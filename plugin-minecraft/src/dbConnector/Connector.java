/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dbConnector;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author tatia
 */
public class Connector {

    private String jbdcURL = "jdbc:sqlite:/C:\\SQLite\\data.db";
    private Connection conn;

    public Connector() {
        try {
            conn = DriverManager.getConnection(jbdcURL);
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    public void registUser(String name) {
        try {
            Statement stm = conn.createStatement();
            stm.execute("INSERT INTO users VALUES ('" + name + "', 0)");
            
            conn.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

}
