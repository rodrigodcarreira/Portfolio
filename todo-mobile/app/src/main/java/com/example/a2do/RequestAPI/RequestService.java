package com.example.a2do.RequestAPI;

import com.example.a2do.Classes.List;
import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface RequestService {

    @Headers("Accept: application/json")
    @POST("login")
    Call<User> login(@Body User user);

    @Headers("Accept: application/json")
    @POST("register")
    Call<Void> register(@Body User user);

    @Headers("Accept: application/json")
    @POST("list")
    Call<List> insertList(@Header("Authorization") String authorization,@Body List list);

    @Headers("Accept: application/json")
    @POST("task")
    Call<Task> insertTask(@Header("Authorization") String authorization, @Body Task task);

    @Headers("Accept: application/json")
    @GET("lists")
    Call<ArrayList<List>> getAllLists(@Header("Authorization") String authorization);

    @Headers("Accept: application/json")
    @GET("tasks")
    Call<ArrayList<Task>> getAllTasks(@Header("Authorization") String authorization);

    @Headers("Accept: application/json")
    @GET("list/{list_id}")
    Call<ArrayList<Task>> getTasks(@Header("Authorization") String authorization,@Path("list_id") int list_id);

    @Headers("Accept: application/json")
    @PUT("task")
    Call<Void> updateTask(@Header("Authorization") String authorization, @Body Task task);

    @Headers("Accept: application/json")
    @PUT("list")
    Call<Void> updateList(@Header("Authorization") String authorization, @Body List list);

    @Headers("Accept: application/json")
    @DELETE("task/{task_id}")
    Call<Void> deleteTask(@Header("Authorization") String authorization, @Path("task_id") int task_id);

    @Headers("Accept: application/json")
    @DELETE("list/{list_id}")
    Call<Void> deleteList(@Header("Authorization") String authorization, @Path("list_id") int list_id);

}
