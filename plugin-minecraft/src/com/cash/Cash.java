/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package com.cash;

import com.cash.events.Events;
import org.bukkit.plugin.java.JavaPlugin;

/**
 *
 * @author Rodrigo Carreira
 */
public class Cash extends JavaPlugin{

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(new Events(), this);
        getServer().getConsoleSender().sendMessage("Cash Plugin ON");
    }

    @Override
    public void onDisable() {
        getServer().getConsoleSender().sendMessage("Cash Plugin OFF");        
    }

    
    
}
