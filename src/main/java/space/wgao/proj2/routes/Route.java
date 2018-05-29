package space.wgao.proj2.routes;

import static spark.Spark.get;

/**
 * Route
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public class Route {

    public static void init() {

        try {

            get("/hello", (req, res) -> "Hello World");

        } catch (Exception ex) {
            // ignored
        }
    }
}
