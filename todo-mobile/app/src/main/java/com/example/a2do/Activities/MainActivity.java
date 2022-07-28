package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.a2do.Classes.List;
import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.textfield.TextInputLayout;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private TextInputLayout usernameInput, passwordInput;
    private String token, username,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        RequestDAO request = new RequestAPI();

        load(request);

        usernameInput = findViewById(R.id.username_input);
        passwordInput = findViewById(R.id.password_input);
        Button confirmBtn = findViewById(R.id.regist_user);
        TextView regist = findViewById(R.id.regist);
        TextView regist2 = findViewById(R.id.regist2);
        FloatingActionButton aboutBtn = findViewById(R.id.floatingActionButton);

        aboutBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(AboutActivity.makeIntent(MainActivity.this));
            }
        });

        regist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(RegistActivity.makeIntent(MainActivity.this));
            }
        });

        regist2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(RegistActivity.makeIntent(MainActivity.this));
            }
        });

        confirmBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String username = usernameInput.getEditText().getText().toString();
                String password = passwordInput.getEditText().getText().toString();
                request.login(new RequestDAO.UserListener() {
                    @Override
                    public void onSuccess(User user) {
                        save(user.getToken(), user.getUsername(),password);
                        startActivity(ListsActivity.makeIntent(MainActivity.this));
                        finish();
                    }

                    @Override
                    public void onError(int code) {
                        switch (code) {
                            case 409:
                                Toast.makeText(MainActivity.this, "Credênciais Inválidas", Toast.LENGTH_SHORT).show();
                        }
                    }
                }, new User(username, password, ""));

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

    private void load(RequestDAO request) {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        token = sharedPreferences.getString(SHARED_PREF_TOKEN, "");
        username = sharedPreferences.getString(SHARED_PREF_USERNAME, "");
        password = sharedPreferences.getString(SHARED_PREF_PASSWORD, "");
        request.getAllLists(new RequestDAO.ListListsistener() {
                                @Override
                                public void onSuccess(ArrayList<List> lists) {
                                    save(token, username,password);
                                    startActivity(ListsActivity.makeIntent(MainActivity.this));
                                    finish();
                                }

                                @Override
                                public void onError(int code) {
                                    return;
                                }
                            }
                , token);
    }

    public static Intent makeIntent(Context context){
        return new Intent(context, MainActivity.class);
    }

}