package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.a2do.Adapter.TaskAdapter;
import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

public class TasksActivity extends AppCompatActivity {

    int list_id;
    private String token, username, listname,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";

    ArrayList<Task> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tasks);

        load();

        RequestDAO request = new RequestAPI();

        list = new ArrayList<>();

        RecyclerView rv = findViewById(R.id.rvAllTask);
        TaskAdapter taskAdapter = new TaskAdapter(list);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());

        request.getTasks(new RequestDAO.ListTasksListener() {
            @Override
            public void onSuccess(ArrayList<Task> tasks) {
                list.addAll(tasks);
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
                            }else {
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
                switch (code) {
                    case 409:
                        Toast.makeText(TasksActivity.this, "Sem tarefas para mostrar!", Toast.LENGTH_LONG).show();
                    case 401: {
                        request.login(new RequestDAO.UserListener() {
                            @Override
                            public void onSuccess(User user) {
                                save(user.getToken(), user.getUsername(), password);
                            }

                            @Override
                            public void onError(int code) {
                                switch (code) {
                                    case 409:
                                        Toast.makeText(TasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                }
                            }
                        }, new User(username, password, ""));
                    }
                    default: {
                        Toast.makeText(TasksActivity.this, "Sem tarefas para mostrar!", Toast.LENGTH_LONG).show();
                    }
                }
            }
        },token,list_id);

        rv.setLayoutManager(layoutManager);
        rv.setItemAnimator(new DefaultItemAnimator());
        rv.setAdapter(taskAdapter);

        Button addTask = findViewById(R.id.btnAddTask);
        TextView titleList = findViewById(R.id.titleTask);
        titleList.setText("Lista: " + listname);


        ImageView exitBtn = findViewById(R.id.exit);

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });


        addTask.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = AddTaskActivity.makeIntent(TasksActivity.this,list_id,listname);
                startActivity(intent);
                finish();
            }
        });

        taskAdapter.setOnItemClickListener(new TaskAdapter.OnItemClickListener(){
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
                            case 409: Toast.makeText(TasksActivity.this, "Falha ao eliminar tarefa!", Toast.LENGTH_LONG).show();
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
                                                Toast.makeText(TasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                }, new User(username, password, ""));
                            }
                            default: {
                                Toast.makeText(TasksActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                            }
                        }
                    }
                },list.get(position).getTask_id(),token);
            }

            @Override
            public void onDetailsClick(int position) {
                String status = list.get(position).getTask_state();
                if (status == "done"){
                    list.get(position).setTask_state("ndone");
                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy-HH:mm");
                    String now = sdf.format(new Date());
                    try {
                        String date = list.get(position).getTask_date();
                        if (!date.contains("-")) {
                            date +="-" + "23:59";
                        }
                        if(sdf.parse(now).after(sdf.parse(date))){
                            list.get(position).setTask_state("late");
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }else{
                    list.get(position).setTask_state("done");
                }
                request.updateTask(new RequestDAO.VoidListener() {
                    @Override
                    public void onSuccess() {
                        taskAdapter.notifyItemChanged(position);
                    }

                    @Override
                    public void onError(int code) {
                        switch (code){
                            case 409: Toast.makeText(TasksActivity.this, "Falha ao atualizar tarefa!", Toast.LENGTH_LONG).show();
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
                                                Toast.makeText(TasksActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                }, new User(username, password, ""));
                            }
                            default: {
                                Toast.makeText(TasksActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                            }
                        }
                    }
                },list.get(position),token);

            }

            @Override
            public void onEditClick(int position) {
                Intent intent = EditTaskActivity.makeIntent(TasksActivity.this,list.get(position),true,listname);
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
        listname = getIntent().getStringExtra("listname");
        list_id = getIntent().getIntExtra("list_id",0);
        password = sharedPreferences.getString(SHARED_PREF_PASSWORD, "");


    }

    public static Intent makeIntent(Context context, int list_id, String listname){
        Intent intent = new Intent(context, TasksActivity.class);
        intent.putExtra("list_id",list_id);
        intent.putExtra("listname",listname);
        return intent;
    }
}