package com.example.a2do.Classes;

public class List {
    private int list_id;
    private String list_name;
    private int list_user_id;

    public List(int list_id, String list_name,int list_user_id) {
        this.list_id = list_id;
        this.list_name = list_name;
        this.list_user_id = list_user_id;
    }

    public int getList_id() {
        return list_id;
    }

    public void setList_id(int list_id) {
        this.list_id = list_id;
    }

    public String getList_name() {
        return list_name;
    }

    public void setList_name(String list_name) {
        this.list_name = list_name;
    }

    public int getList_user_id() {
        return list_user_id;
    }

    public void setList_user_id(int list_user_id) {
        this.list_user_id = list_user_id;
    }
}
