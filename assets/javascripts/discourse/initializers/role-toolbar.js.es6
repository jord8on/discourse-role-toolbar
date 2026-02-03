import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'role-toolbar',

  initialize() {
    withPluginApi('0.8.7', api => {
      const user = api.getCurrentUser();
      // example: groups allowed to see extra buttons
      const allowedGroups = ['staff', 'moderators'];

      api.onToolbarCreate(toolbar => {
        // hide the italic button for users not in allowed groups
        if (!user || !user.groups.some(g => allowedGroups.includes(g.name))) {
          toolbar.removeButton('italic');
        }

        // move the bold button to the end of the primary group
        const bold = toolbar.getButton('bold');
        if (bold) {
          toolbar.removeButton('bold');
          toolbar.addButton('bold');
        }

        // remove a secondary-menu option, e.g., strikethrough
        const secondary = toolbar.groups.get('secondary');
        secondary?.removeButton('strikethrough');
      });
    });
  }
};
