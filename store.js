const orgInstall = require('./database/auth/store_user_org_install');
const workspaceAuth = require('./database/auth/store_user_workspace_install');

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
      const findUser = await db.findUser(installQuery.enterpriseId);
      return findUser;
    }
    if (installQuery.teamId !== undefined) {
      const findUser = await db.findUser(installQuery.teamId);
      return findUser;
    }
    throw new Error('Failed fetching installation');
  },
};
