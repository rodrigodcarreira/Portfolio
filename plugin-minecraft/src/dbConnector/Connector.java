package dbConnector;

import Classes.User;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;

/**
 *
 * @author rodrigodcarreira
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

    public User registUser(String name) {
        try {
            Statement stm = conn.createStatement();
            ResultSet result = stm.executeQuery("SELECT * FROM users WHERE name like '" + name + "';");
            while (result.next()) {
                return new User(result.getInt("id"), name, result.getInt("coins"), false);
            }
            stm.close();
            stm = conn.createStatement();
            stm.execute("INSERT INTO users(name, coins) VALUES ('" + name + "', 0);");
            return new User(0, name, 0, true);
        } catch (SQLException ex) {
            ex.printStackTrace();
            return null;
        }
    }

}
