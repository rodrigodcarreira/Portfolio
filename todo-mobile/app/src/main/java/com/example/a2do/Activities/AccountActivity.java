package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.a2do.Classes.List;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestDAO;

import java.util.ArrayList;

public class AccountActivity extends AppCompatActivity {

    private String token, username,password;

    private static final String SHARED_PREF_USER = "USER";
    private static final String SHARED_PREF_TOKEN = "TOKEN";
    private static final String SHARED_PREF_USERNAME = "USERNAME";
    private static final String SHARED_PREF_PASSWORD = "PASSWORD";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);

        TextView title = findViewById(R.id.textView8);

        load();

        title.setText("Utilizador "+ username + " com Sessão Iniciada");

        ImageView exitBtn = findViewById(R.id.exit);

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(ListsActivity.makeIntent(AccountActivity.this));
                finish();
            }
        });

        Button logout = findViewById(R.id.button);

        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                save();
                startActivity(MainActivity.makeIntent(AccountActivity.this));
                finish();
            }
        });
    }

    private void save() {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(SHARED_PREF_TOKEN, "");
        editor.putString(SHARED_PREF_USERNAME, "");
        editor.apply();
    }

    private void load() {
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_USER, Context.MODE_PRIVATE);
        token = sharedPreferences.getString(SHARED_PREF_TOKEN, "");
        username = sharedPreferences.getString(SHARED_PREF_USERNAME, "");
        password = sharedPreferences.getString(SHARED_PREF_PASSWORD, "");

    }

    public static Intent makeIntent(Context context) {
        Intent intent = new Intent(context, AccountActivity.class);
        return intent;
    }
}