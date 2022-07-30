package com.cash.events;

import Classes.User;
import dbConnector.Connector;
import java.util.Random;
import org.bukkit.entity.Creature;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Monster;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDeathEvent;
import org.bukkit.event.player.PlayerJoinEvent;

/**
 *
 * @author rodrigodcarreira
 */
public class Events implements Listener {

    private static Connector conn = new Connector();

    @EventHandler
    public static void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();

        User user = conn.getUser(player.getName());

        if (user != null) {
            player.sendMessage("Welcome again " + player.getName());
            player.sendMessage("You have " + user.getCoins() + " coins.");
        } else {
            conn.RegistUser(player.getName());
            player.sendMessage("Welcome to the server " + player.getName());
            player.sendMessage("You have 0 coins. Kill some mobs to get more!!!");
        }

    }

    @EventHandler
    public static void onEntityKill(EntityDeathEvent event) {

        Entity killer = event.getEntity().getKiller();
        Entity dead = event.getEntity();

        if (killer instanceof Player) {
            Player player = (Player) killer;
            if (dead instanceof Creature) {
                if (dead instanceof Monster) {
                    Random random = new Random();
                    if (conn.addCoins(player.getName(), random.nextInt(1, 3))) {
                        User user = conn.getUser(player.getName());
                        player.sendMessage("You have " + user.getCoins() + " coins !");
                    } else {
                        player.sendMessage("Error");
                    }
                } else {
                    player.sendMessage("Don`t Kill None Hostile Mobs Please!");
                }
            }
        }

    }
}
