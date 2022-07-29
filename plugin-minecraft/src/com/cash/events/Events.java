package com.cash.events;

import Classes.User;
import dbConnector.Connector;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

/**
 *
 * @author rodrigodcarreira
 */
public class Events implements Listener {

    @EventHandler
    public static void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        String name = player.getName();
        Connector conn = new Connector();
        User user = conn.registUser(name);
        
        if (user != null) {
            if (user.isFirst()) {
                player.sendMessage("Welcome to the server " + name);
                player.sendMessage("You have 0 coins. Kill some mobs to get more!!!");
            } else {
                player.sendMessage("Welcome again " + name);
                player.sendMessage("You have 0 coins.");
            }
        }

    }
}
