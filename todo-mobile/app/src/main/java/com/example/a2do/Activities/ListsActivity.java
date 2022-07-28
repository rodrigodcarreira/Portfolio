package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.a2do.Adapter.ListTaskAdapter;
import com.example.a2do.Classes.List;
import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.chip.Chip;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class ListsActivity extends AppCompatActivity {

    private String token, username,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";

    ArrayList<List> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lists);

        load();

        RequestDAO request = new RequestAPI();

        list = new ArrayList<List>();

        RecyclerView rv = findViewById(R.id.rvAllTask);
        ListTaskAdapter listAdapter = new ListTaskAdapter(list);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());

        request.getAllLists(new RequestDAO.ListListsistener() {
            @Override
            public void onSuccess(ArrayList<List> lists) {
                list.addAll(lists);
                listAdapter.notifyDataSetChanged();
            }

            @Override
            public void onError(int code) {
                switch (code){
                    case 409: Toast.makeText(ListsActivity.this, "Erro ao carregar a lista", Toast.LENGTH_LONG).show();
                    case 404: Toast.makeText(ListsActivity.this, "Sem listas para mostrar", Toast.LENGTH_LONG).show();
                    case 401: {
                        startActivity(MainActivity.makeIntent(ListsActivity.this));
                        Toast.makeText(ListsActivity.this, "Sessão Expirou", Toast.LENGTH_LONG).show();
                        finish();
                    }
                    default: {
                        Toast.makeText(ListsActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                    }
                }
            }
        }, token);

        rv.setLayoutManager(layoutManager);
        rv.setItemAnimator(new DefaultItemAnimator());
        rv.setAdapter(listAdapter);

        TextView title = findViewById(R.id.titleTask);
        EditText listName = findViewById(R.id.listNameInput);
        Chip chip = findViewById(R.id.chipShowAll);
        Button addList = findViewById(R.id.btnAddList);
        title.setText("Listas de " + username);

        ImageView exitBtn = findViewById(R.id.exit);

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(AccountActivity.makeIntent(ListsActivity.this));
                finish();
            }
        });

        chip.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = AllTasksActivity.makeIntent(ListsActivity.this);
                startActivity(intent);
            }
        });

        addList.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                if (!listName.getText().toString().equals("")) {
                    request.insertList(new RequestDAO.Lististener() {
                        @Override
                        public void onSuccess(List lista) {
                            list.add(lista);
                            listAdapter.notifyDataSetChanged();

                        }
                        @Override
                        public void onError(int code) {
                            switch (code){
                                case 409: Toast.makeText(ListsActivity.this, "Lista já existe", Toast.LENGTH_LONG).show();
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
                                            }
                                        }
                                    }, new User(username, password, ""));
                                }
                                default: {
                                    Toast.makeText(ListsActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                                }
                            }
                        }
                    }, new List(0, listName.getText().toString(),0), token);
                }
            }
        });

        listAdapter.setOnItemClickListener(new ListTaskAdapter.OnItemClickListener() {
            @Override
            public void onDeleteClick(int position) {
                request.deleteList(new RequestDAO.VoidListener() {
                    @Override
                    public void onSuccess() {
                        list.remove(position);
                        listAdapter.notifyItemRemoved(position);
                    }

                    @Override
                    public void onError(int code) {
                        switch (code){
                            case 409: Toast.makeText(ListsActivity.this, "Lista contém tarefas por eliminar!", Toast.LENGTH_LONG).show();
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
                                                Toast.makeText(ListsActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                }, new User(username, password, ""));
                            }
                            default: {
                                Toast.makeText(ListsActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                            }
                        }
                    }
                },list.get(position).getList_id(),token);
            }

            @Override
            public void onDetailsClick(int position) {
                Intent intent = TasksActivity.makeIntent(ListsActivity.this, list.get(position).getList_id(),list.get(position).getList_name());
                startActivity(intent);
            }

            @Override
            public void onEditClick(int position) {
                BottomSheetDialog btmSht = new BottomSheetDialog(ListsActivity.this);
                btmSht.setContentView(R.layout.modal_edit_list);
                btmSht.setCanceledOnTouchOutside(false);
                Button btnEdit = btmSht.findViewById(R.id.editListBtn);
                EditText editText2 = btmSht.findViewById(R.id.editListInput);

                editText2.setText(list.get(position).getList_name());

                btnEdit.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        if (!editText2.getText().toString().equals("")) {

                            request.updateList(new RequestDAO.VoidListener() {
                                @Override
                                public void onSuccess() {
                                    list.set(position, new List(list.get(position).getList_id(),editText2.getText().toString(),list.get(position).getList_user_id()));
                                    rv.setLayoutManager(layoutManager);
                                    rv.setItemAnimator(new DefaultItemAnimator());
                                    rv.setAdapter(listAdapter);
                                    btmSht.cancel();
                                }

                                @Override
                                public void onError(int code) {
                                    switch (code){
                                        case 409: Toast.makeText(getApplicationContext(), "Lista já existe", Toast.LENGTH_LONG).show();
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
                                                            Toast.makeText(ListsActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                                                    }
                                                }
                                            }, new User(username, password, ""));
                                        }
                                        default: {
                                            Toast.makeText(ListsActivity.this, "Falha na rede", Toast.LENGTH_LONG).show();
                                        }
                                    }
                                }
                            },new List(list.get(position).getList_id(),editText2.getText().toString(),list.get(position).getList_user_id()),token);
                        } else {
                            Toast.makeText(getApplicationContext(), "Lista inválida", Toast.LENGTH_LONG).show();
                        }
                    }
                });
                btmSht.show();
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
        Intent intent = new Intent(context, ListsActivity.class);
        return intent;
    }
}