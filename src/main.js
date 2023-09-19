import { config } from "dotenv";
import httpServer from "./config/http.js";
import sequelize from "./config/db.js";
import createAdminIfNotExists from "./config/admin.js";

config();

async function bootstrap() {
    try {
        await sequelize.sync({ force: true }); 
        await createAdminIfNotExists();
        httpServer.listen(process.env.PORT, () => {
            console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

// Llamamos a la función bootstrap para iniciar el servidor
bootstrap();