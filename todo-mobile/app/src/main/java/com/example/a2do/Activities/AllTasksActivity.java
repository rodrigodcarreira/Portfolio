package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.a2do.Adapter.TaskAdapter;
import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

public class AllTasksActivity extends AppCompatActivity {
    private String token, username,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";

    ArrayList<Task> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_all_tasks);

        load();

        list = new ArrayList<>();

        RequestDAO request = new RequestAPI();

        RecyclerView rv = findViewById(R.id.rvAllTask);
        TaskAdapter taskAdapter = new TaskAdapter(list);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());

        request.getAllTasks(new RequestDAO.ListTasksListener() {
            @Override
            public void onSuccess(ArrayList<Task> lists) {
                list.addAll(lists);

                Collections.sort(list, new Comparator<Task>() {
                    @Override
                    public int compare(Task task, Task t1) {
                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy-HH:mm");

                        Date date1 = null;
                        Date date2 = null;
                        try {
                            if (task.getTask_date().contains("-")) {
                                date1 = sdf.parse(task.getTask_date());
                            } else {
                                date1 = sdf.parse(task.getTask_date() + "-" + "23:59");
                            }
                            if (t1.getTask_date().contains("-")) {
                                date2 = sdf.parse(t1.getTask_date());
                            } else {
                                date2 = sdf.parse(t1.getTask_date() + "-" + "23:59");
                            }
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        return date1.compareTo(date2);
                    }
                });
                taskAdapter.notifyDataSetChanged();
            }

            @Override
            public void onError(int code) {
                switch (code){
                    case 409: Toast.makeText(AllTasksActivity.this, "Erro ao carregar a lista de tarefas", Toast.LENGTH_LONG).show();
                    case 404: Toast.makeText(AllTasksActivity.this, "Sem tarefas para mostrar", Toast.LENGTH_LONG).show();
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
                                        Toast.makeText(AllTasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                }
                            }
                        }, new User(username, password, ""));
                    }
                    default: {
                        Toast.makeText(AllTasksActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                    }
                }
            }
        },token);


        Button back = findViewById(R.id.back);

        rv.setLayoutManager(layoutManager);
        rv.setItemAnimator(new DefaultItemAnimator());
        rv.setAdapter(taskAdapter);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        taskAdapter.setOnItemClickListener(new TaskAdapter.OnItemClickListener() {
            @Override
            public void onDeleteClick(int position) {
                request.deleteTask(new RequestDAO.VoidListener() {
                    @Override
                    public void onSuccess() {
                        list.remove(position);
                        taskAdapter.notifyItemRemoved(position);
                    }

                    @Override
                    public void onError(int code) {
                        switch (code){
                            case 409: Toast.makeText(AllTasksActivity.this, "Falha ao eliminar tarefa!", Toast.LENGTH_LONG).show();
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
                                                Toast.makeText(AllTasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                }, new User(username, password, ""));
                            }
                            default: {
                                Toast.makeText(AllTasksActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                            }
                        }
                    }
                },list.get(position).getTask_id(),token);
            }

            @Override
            public void onDetailsClick(int position) {
                String status = list.get(position).getTask_state();
                String nStatus, date = "";
                if (status == "done") {
                    nStatus = "ndone";

                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
                    String now = sdf.format(new Date());
                    try {
                        date = list.get(position).getTask_date();
                        if (!date.contains("-")) {
                            date += date + "-" + "23:59";
                        }
                        if (sdf.parse(now).after(sdf.parse(date))) {
                            nStatus = "late";

                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                } else {
                    nStatus = "done";
                }
                request.updateTask(new RequestDAO.VoidListener() {
                    @Override
                    public void onSuccess() {
                        taskAdapter.notifyItemChanged(position);
                    }

                    @Override
                    public void onError(int code) {
                        switch (code){
                            case 409: Toast.makeText(AllTasksActivity.this, "Falha ao atualizar tarefa!", Toast.LENGTH_LONG).show();
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
                                                Toast.makeText(AllTasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                }, new User(username, password, ""));
                            }
                            default: {
                                Toast.makeText(AllTasksActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                            }
                        }
                    }
                },list.get(position),token);
            }

            @Override
            public void onEditClick(int position) {
                Intent intent = EditTaskActivity.makeIntent(AllTasksActivity.this, list.get(position), false,"");
                startActivity(intent);
                finish();
            }
        });
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

    public static Intent makeIntent(Context context) {
        Intent intent = new Intent(context, AllTasksActivity.class);
        return intent;
    }
}