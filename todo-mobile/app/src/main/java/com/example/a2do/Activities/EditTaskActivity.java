package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;

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

public class EditTaskActivity extends AppCompatActivity implements DatePickerDialog.OnDateSetListener {

    private String token,username,listname,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";


    private EditText time, date;
    private int hour, minute;
    private Task task;
    Boolean bool;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task);

        load();

        RequestDAO request = new RequestAPI();

        TextView title = findViewById(R.id.titleAddTask);
        title.setText("Editar Tarefa");
        EditText name = findViewById(R.id.nameTaskInput);
        Button add = findViewById(R.id.btnConfirm);
        date = findViewById(R.id.dateInput);
        time = findViewById(R.id.timeInput);

        ImageView exitBtn = findViewById(R.id.exit);

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (bool){
                    startActivity(TasksActivity.makeIntent(EditTaskActivity.this,task.getTask_list_id(),listname));
                }else{
                    startActivity(AllTasksActivity.makeIntent(EditTaskActivity.this));
                }
                finish();
            }
        });

        name.setText(task.getTask_description());
        if (task.getTask_date().contains("-")) {
            date.setText(task.getTask_date().split("-")[0]);
            time.setText(task.getTask_date().split("-")[1]);
        }else{
            date.setText(task.getTask_date());
        }

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
                String status = task.getTask_state();
                System.out.println(status   );
                if (name.getText().toString().length() != 0 && date.getText().toString().length() != 0) {
                        String dateStr,dateStr2;
                        dateStr = date.getText().toString();
                        if (time.getText().toString().length() != 0) {
                            dateStr += "-" + time.getText().toString();
                        }
                        dateStr2 = dateStr;
                        if (task.getTask_state().equals("ndone")) {
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
                        }
                        request.updateTask(new RequestDAO.VoidListener() {
                            @Override
                            public void onSuccess() {
                                if (bool){
                                    startActivity(TasksActivity.makeIntent(EditTaskActivity.this,task.getTask_list_id(),listname));
                                }else{
                                    startActivity(AllTasksActivity.makeIntent(EditTaskActivity.this));
                                }
                                finish();
                            }

                            @Override
                            public void onError(int code) {
                                switch (code){
                                    case 409: Toast.makeText(EditTaskActivity.this, "Tarefa em conflito", Toast.LENGTH_LONG).show();
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
                                                        Toast.makeText(EditTaskActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        }, new User(username, password, ""));
                                    }
                                    default: {
                                        Toast.makeText(EditTaskActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                                    }
                                }
                            }
                        },new Task(task.getTask_id(),name.getText().toString(),dateStr2,status,task.getTask_list_id()),token);

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

    private void save(String token, String username,String password) {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(SHARED_PREF_TOKEN, token);
        editor.putString(SHARED_PREF_USERNAME, username);
        editor.putString(SHARED_PREF_PASSWORD, password);
        editor.apply();
    }

    private void load() {
        Intent intent = getIntent();
        task = (Task) intent.getSerializableExtra("task");
        bool = intent.getBooleanExtra("bool",true);
        listname = intent.getStringExtra("listname");
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        token = sharedPreferences.getString(SHARED_PREF_TOKEN, "");
        username = sharedPreferences.getString(SHARED_PREF_USERNAME, "");
        password = sharedPreferences.getString(SHARED_PREF_PASSWORD, "");

    }

    public static Intent makeIntent(Context context,Task task,boolean bool,String listname) {
        Intent intent = new Intent(context, EditTaskActivity.class);
        intent.putExtra("task",task);
        intent.putExtra("listname",listname);
        intent.putExtra("bool",bool);
        return intent;
    }
}
