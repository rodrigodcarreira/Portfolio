package com.example.a2do.Classes;

import com.example.a2do.Activities.MainActivity;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Task implements Serializable, Comparable<Task> {
    private int task_id;
    private String task_description;
    private String task_date;
    private String task_state;
    private int task_list_id;

    public Task(int task_id, String task_description, String task_date, String task_state, int task_list_id) {
        this.task_id = task_id;
        this.task_description = task_description;
        this.task_date = task_date;
        this.task_state = task_state;
        this.task_list_id = task_list_id;
    }

    public int getTask_id() {
        return task_id;
    }

    public void setTask_id(int task_id) {
        this.task_id = task_id;
    }

    public String getTask_description() {
        return task_description;
    }

    public void setTask_description(String task_description) {
        this.task_description = task_description;
    }

    public String getTask_date() {
        return task_date;
    }

    public void setTask_date(String task_date) {
        this.task_date = task_date;
    }

    public String getTask_state() {
        return task_state;
    }

    public void setTask_state(String task_state) {
        this.task_state = task_state;
    }

    public int getTask_list_id() {
        return task_list_id;
    }

    public void setTask_list_id(int task_list_id) {
        this.task_list_id = task_list_id;
    }

    @Override
    public int compareTo(Task task) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy-HH:mm");

        Date date1 = null;
        Date date2 = null;
        try {
            if (task.getTask_date().contains("-")) {
                date1 = sdf.parse(task.getTask_date());
            } else {
                date1 = sdf.parse(task.getTask_date() + "-" + "23:59");
            }
            if (this.getTask_date().contains("-")) {
                date2 = sdf.parse(this.getTask_date());
            }else {
                date2 = sdf.parse(this.getTask_date() + "-" + "23:59");
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date1.compareTo(date2);
    }
}
