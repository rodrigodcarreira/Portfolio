package com.example.a2do.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.a2do.Classes.User;
import com.example.a2do.R;
import com.example.a2do.RequestAPI.RequestAPI;
import com.example.a2do.RequestAPI.RequestDAO;
import com.google.android.material.textfield.TextInputLayout;

public class RegistActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_regist);

        TextInputLayout usernameInput = findViewById(R.id.username_input);
        TextInputLayout passwordInput = findViewById(R.id.password_input);
        ImageView exitBtn = findViewById(R.id.exit);
        Button confirm = findViewById(R.id.regist_user);

        RequestDAO request = new RequestAPI();

        confirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String username = usernameInput.getEditText().getText().toString();
                String password = passwordInput.getEditText().getText().toString();
                if (username.length() > 3 && password.length() > 3) {
                    request.register(new RequestDAO.VoidListener() {
                        @Override
                        public void onSuccess() {
                            Toast.makeText(RegistActivity.this, "Utilizador criado", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                        @Override
                        public void onError(int code) {
                            switch (code){
                                case 400: Toast.makeText(RegistActivity.this, "Dados Inválidos", Toast.LENGTH_SHORT).show();
                                case 409: Toast.makeText(RegistActivity.this, "Utilizador já se encontra criado", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }, new User(username, password, ""));
                }
            }
        });

        exitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });



    }

    public static Intent makeIntent(Context context){
        return new Intent(context, RegistActivity.class);
    }
}