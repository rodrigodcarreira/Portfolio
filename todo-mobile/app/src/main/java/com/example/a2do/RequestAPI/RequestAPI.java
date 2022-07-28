package com.example.a2do.RequestAPI;

import com.example.a2do.Classes.List;
import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;

import java.util.ArrayList;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RequestAPI implements RequestDAO {

    String host_port = "https://tam-todo.herokuapp.com";  // host computer from emulator
    //String host_port = "192.168.1.68:8080";  // server computer from real device

    RequestService requestService;

    public RequestAPI() {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        // set your desired log level (others: NONE, BASIC, HEADERS)
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        // add logging as a interceptor (it should be the last one)
        httpClient.addInterceptor(logging);

        Retrofit.Builder builder = new Retrofit.Builder()
                .baseUrl(host_port + "/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(httpClient.build());

        Retrofit retrofit = builder.build();

        requestService = retrofit.create(RequestService.class);

    }


    @Override
    public void register(VoidListener listener, User user) {
        Call<Void> call = requestService.register(user);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                switch(response.code()){
                    case 201:
                        listener.onSuccess(); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onError(500);
            }
        });
    }

    @Override
    public void insertList(Lististener listener, List list, String Auth) {
        Call<List> call = requestService.insertList(Auth,list);

        call.enqueue(new Callback<List>() {
            @Override
            public void onResponse(Call<List> call, Response<List> response) {
                switch(response.code()){
                    case 201:
                        List list = response.body();
                        listener.onSuccess(list); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<List> call, Throwable t) {

            }
        });
    }

    @Override
    public void insertTask(TaskListener listener, Task task, String Auth) {
        Call<Task> call = requestService.insertTask(Auth,task);

        call.enqueue(new Callback<Task>() {
            @Override
            public void onResponse(Call<Task> call, Response<Task> response) {
                switch(response.code()){
                    case 201:
                        Task task = response.body();
                        listener.onSuccess(task); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Task> call, Throwable t) {

            }
        });
    }

    @Override
    public void updateTask(VoidListener listener, Task task, String Auth) {
        Call<Void> call = requestService.updateTask(Auth,task);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                switch(response.code()){
                    case 200:
                        listener.onSuccess(); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onError(500);
            }
        });
    }

    @Override
    public void updateList(VoidListener listener, List list, String Auth) {
        Call<Void> call = requestService.updateList(Auth,list);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                switch(response.code()){
                    case 200:
                        listener.onSuccess(); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onError(500);
            }
        });
    }

    @Override
    public void deleteTask(VoidListener listener, int task_id, String Auth) {
        Call<Void> call = requestService.deleteTask(Auth,task_id);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                switch(response.code()){
                    case 200:
                        listener.onSuccess(); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onError(500);
            }
        });
    }

    @Override
    public void deleteList(VoidListener listener, int list_id, String Auth) {
        Call<Void> call = requestService.deleteList(Auth,list_id);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                switch(response.code()){
                    case 200:
                        listener.onSuccess(); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                listener.onError(500);
            }
        });
    }

    @Override
    public void login(UserListener listener, User user) {
        Call<User> call = requestService.login(user);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                switch (response.code()) {
                    case 200:
                        User user = response.body();
                        if (user == null) {
                            listener.onError(400);
                            return;
                        }
                        listener.onSuccess(user);
                        break;

                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                listener.onError(500);

            }
        });
    }

    @Override
    public void getAllTasks(ListTasksListener listener, String Auth) {
        Call<ArrayList<Task>> call = requestService.getAllTasks(Auth);

        call.enqueue(new Callback<ArrayList<Task>>() {
            @Override
            public void onResponse(Call<ArrayList<Task>> call, Response<ArrayList<Task>> response) {
                switch(response.code()){
                    case 200:
                        ArrayList<Task> task = response.body();
                        listener.onSuccess(task); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Task>> call, Throwable t) {
                listener.onError(500);

            }
        });
    }

    @Override
    public void getTasks(ListTasksListener listener, String Auth, int list_id) {
        Call<ArrayList<Task>> call = requestService.getTasks(Auth,list_id);

        call.enqueue(new Callback<ArrayList<Task>>() {
            @Override
            public void onResponse(Call<ArrayList<Task>> call, Response<ArrayList<Task>> response) {
                switch(response.code()){
                    case 200:
                        ArrayList<Task> task = response.body();
                        listener.onSuccess(task); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Task>> call, Throwable t) {
                listener.onError(500);

            }
        });
    }

    @Override
    public void getAllLists(ListListsistener listener, String Auth) {
        Call<ArrayList<List>> call = requestService.getAllLists(Auth);

        call.enqueue(new Callback<ArrayList<List>>() {

            @Override
            public void onResponse(Call<ArrayList<List>> call, Response<ArrayList<List>> response) {
                switch(response.code()){
                    case 200:
                        ArrayList<List> lists = response.body();
                        listener.onSuccess(lists); break;
                    default:
                        listener.onError(response.code());
                }
            }

            @Override
            public void onFailure(Call<ArrayList<List>> call, Throwable t) {

            }
        });
    }


}
