import cron from "node-cron";
import { Op } from "sequelize";
import authModel from "../modules/auth/auth.model.js";

const startDeleteUnverifiedUsersJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const deletedUsers = await UserActivation.destroy({
        where: {
          emailVerified: false,
          createdAt: {
            [Op.lt]: new Date(Date.now() - 60 * 60 * 1000),
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
};

export default startDeleteUnverifiedUsersJob;