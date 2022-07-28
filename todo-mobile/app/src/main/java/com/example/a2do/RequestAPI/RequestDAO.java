package com.example.a2do.RequestAPI;

import com.example.a2do.Classes.List;
import com.example.a2do.Classes.Task;
import com.example.a2do.Classes.User;

import java.util.ArrayList;

public interface RequestDAO {

    public interface VoidListener{
        public void onSuccess();
        public void onError(int code);
    }
    public void register(VoidListener listener, User user);

    public void updateTask(VoidListener listener, Task task, String Auth);
    public void updateList(VoidListener listener, List list, String Auth);
    public void deleteTask(VoidListener listener, int id, String Auth);
    public void deleteList(VoidListener listener, int id, String Auth);

    public interface UserListener{
        public void onSuccess(User user);
        public void onError(int code);
    }
    public void login(UserListener listener, User user);


    public interface ListTasksListener{
        public void onSuccess(ArrayList<Task> tasks);
        public void onError(int code);
    }
    public void getAllTasks(ListTasksListener listener, String Auth);
    public void getTasks(ListTasksListener listener, String Auth, int list_id);


    public interface ListListsistener{
        public void onSuccess(ArrayList<List> lists);
        public void onError(int code);
    }
    public void getAllLists(ListListsistener listener, String Auth);

    public interface Lististener{
        public void onSuccess(List list);
        public void onError(int code);
    }
    public void insertList(Lististener listener, List list, String Auth);

    public interface TaskListener{
        public void onSuccess(Task task);
        public void onError(int code);
    }
    public void insertTask(TaskListener listener, Task task, String Auth);



}
