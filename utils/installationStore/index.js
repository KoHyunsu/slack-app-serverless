const db = require('./db');
const orgInstall = require('./store_user_org_install');
const workspaceAuth = require('./store_user_workspace_install');

db.connect();

module.exports.store = {
  storeInstallation: async (installation) => {
    if (
      installation.isEnterpriseInstall
      && installation.enterprise !== undefined
    ) {
      const saveUserOrgInstall = await orgInstall.saveUserOrgInstall(installation);
      return saveUserOrgInstall;
    }
    if (installation.team !== undefined) {
      const saveUserWorkspaceInstall = await workspaceAuth.saveUserWorkspaceInstall(installation);
      return saveUserWorkspaceInstall;
    }
    throw new Error('Failed saving installation data to installationStore');
  },
  fetchInstallation: async (installQuery) => {
    if (
      installQuery.isEnterpriseInstall
      && installQuery.enterpriseId !== undefined
    ) {
      // eslint-disable-next-line no-return-await
      return await db.findUser(installQuery.enterpriseId);
    }
    if (installQuery.teamId !== undefined) {
      const findUser = await db.findUser(installQuery.teamId);
      return findUser;
    }
    throw new Error('Failed fetching installation');
  },
};
