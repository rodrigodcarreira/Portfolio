package com.example.a2do.Activities;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class AddTaskActivity extends AppCompatActivity implements DatePickerDialog.OnDateSetListener {

    int list_id;
    private String token, username,password;
    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";


    private String user, listname;
    private EditText time, date;
    private int hour, minute;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task);

        getData();
        load();

        ImageView exitBtn = findViewById(R.id.exit);

        RequestDAO request = new RequestAPI();

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = TasksActivity.makeIntent(AddTaskActivity.this, list_id,listname);
                startActivity(intent);
                finish();
            }
        });

        TextView title = findViewById(R.id.titleAddTask);
        title.setText("Adicionar Tarefa á lista " + listname);
        EditText name = findViewById(R.id.nameTaskInput);
        Button add = findViewById(R.id.btnConfirm);
        date = findViewById(R.id.dateInput);
        time = findViewById(R.id.timeInput);

        date.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showDatePickerDialog();
            }
        });

        time.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                popTimePicker(view);
            }
        });

        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String status = "ndone";
                if (name.getText().toString().length() != 0 && date.getText().toString().length() != 0) {
                    String dateStr, dateStr2;
                    dateStr = date.getText().toString();
                    if (time.getText().toString().length() != 0) {
                        dateStr += "-" + time.getText().toString();
                    }
                    dateStr2 = dateStr;
                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy-HH:mm");
                    String now = sdf.format(new Date());
                    try {
                        if (!dateStr.contains("-")) {
                            dateStr += "-" + "23:59";
                        }
                        if (sdf.parse(now).after(sdf.parse(dateStr))) {
                            status = "late";
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    request.insertTask(new RequestDAO.TaskListener() {
                        @Override
                        public void onSuccess(Task task) {
                            Intent intent = TasksActivity.makeIntent(AddTaskActivity.this, list_id,listname);
                            startActivity(intent);
                            finish();
                        }

                        @Override
                        public void onError(int code) {
                            switch (code){
                                case 409: Toast.makeText(AddTaskActivity.this, "Tarefa em conflito", Toast.LENGTH_LONG).show();
                                case 401: {
                                    request.login(new RequestDAO.UserListener() {
                                        @Override
                                        public void onSuccess(User user) {
                                            save(user.getToken(), user.getUsername(),password);
                                        }

                                        @Override
                                        public void onError(int code) {
                                            switch (code) {
                                                case 409:
                                                    Toast.makeText(AddTaskActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                            }
                                        }
                                    }, new User(username, password, ""));
                                }
                                default: {
                                    Toast.makeText(AddTaskActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                                }
                            }
                        }
                    }, new Task(0,name.getText().toString(),dateStr2,status,list_id),token);
                } else {
                    Toast.makeText(AddTaskActivity.this, "Tarefa já existe!!!", Toast.LENGTH_LONG).show();
                }

            }
        });

    }

    public void showDatePickerDialog() {
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                this,
                this,
                Calendar.getInstance().get(Calendar.YEAR),
                Calendar.getInstance().get(Calendar.MONTH),
                Calendar.getInstance().get(Calendar.DAY_OF_MONTH));
        datePickerDialog.show();
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Calendar cal = Calendar.getInstance();
        cal.set(year, month, dayOfMonth); //year is as expected, month is zero based, date is as expected
        Date dt = cal.getTime();
        date.setText(sdf.format(dt));
    }

    public void popTimePicker(View view) {
        TimePickerDialog.OnTimeSetListener onTimeSetListener = new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker timePicker, int selectedHour, int selectedMinute) {
                hour = selectedHour;
                minute = selectedMinute;
                time.setText(String.format(Locale.getDefault(), "%02d:%02d", hour, minute));
            }
        };

        int style = AlertDialog.THEME_HOLO_LIGHT;

        TimePickerDialog timePickerDialog = new TimePickerDialog(this, style, onTimeSetListener, hour, minute, true);
        timePickerDialog.setTitle("Selecionar Data e Hora");
        timePickerDialog.show();
    }

    public void getData() {
        Intent intent = getIntent();
        list_id = getIntent().getIntExtra("list_id", 0);
        listname = getIntent().getStringExtra("listname");

    }

    private void save(String token, String username,String password) {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(SHARED_PREF_TOKEN, token);
        editor.putString(SHARED_PREF_USERNAME, username);
        editor.putString(SHARED_PREF_PASSWORD, password);
        editor.apply();
    }

    private void load() {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        token = sharedPreferences.getString(SHARED_PREF_TOKEN, "");
        username = sharedPreferences.getString(SHARED_PREF_USERNAME, "");
        password = sharedPreferences.getString(SHARED_PREF_PASSWORD, "");

    }

    public static Intent makeIntent(Context context, int list_id, String listname) {
        Intent intent = new Intent(context, AddTaskActivity.class);
        intent.putExtra("list_id", list_id);
        intent.putExtra("listname", listname);
        return intent;
    }

}