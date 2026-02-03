import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "role-toolbar",

  initialize() {
    withPluginApi("0.8.7", (api) => {
      const user = api.getCurrentUser();
      const allowedGroups = ["staff", "moderators"]; // groups allowed to see extra buttons

      api.onToolbarCreate((toolbar) => {
        // Hide the italic button for users not in allowed groups
        if (!user || !user.groups.some((g) => allowedGroups.includes(g.name))) {
          toolbar.removeButton("italic");
        }

        // Move the bold button to the end of the primary group
        const bold = toolbar.getButton("bold");
        if (bold) {
          toolbar.removeButton("bold");
          toolbar.addButton(bold); // re-add at the end
        }

        // Remove the built‑in strikethrough from the secondary menu
        const secondary = toolbar.groups.get("secondary");
        secondary?.removeButton("strikethrough");

        // Add extra buttons only for the allowed groups
        if (user && user.groups.some((g) => allowedGroups.includes(g.name))) {
          const buttons = [
            {
              id: "underline_role_button",
              group: "fontStyles",
              icon: "underline",
              shortcut: "U",
              title: "Underline",
              perform: (e) => e.applySurround("[u]", "[/u]", "underline"),
            },
            {
              id: "strikethrough_role_button",
              group: "fontStyles",
              icon: "strikethrough",
              title: "Strike-through",
              perform: (e) => e.applySurround("<s>", "</s>", "strike"),
            },
            {
              id: "superscript_role_button",
              group: "fontStyles",
              icon: "superscript",
              title: "Superscript",
              perform: (e) => e.applySurround("<sup>", "</sup>", "sup"),
            },
            {
              id: "subscript_role_button",
              group: "fontStyles",
              icon: "subscript",
              title: "Subscript",
              perform: (e) => e.applySurround("<sub>", "</sub>", "sub"),
            },
            {
              id: "align_left_role_button",
              group: "extras",
              icon: "align-left",
              title: "Align left",
              perform: (e) => e.applySurround('[wrap="left"]\n', "\n[/wrap]", "left"),
            },
              {
              id: "align_center_role_button",
              group: "extras",
              icon: "align-center",
              title: "Align center",
              perform: (e) => e.applySurround('[wrap="center"]\n', "\n[/wrap]", "center"),
            },
            {
              id: "align_right_role_button",
              group: "extras",
              icon: "align-right",
              title: "Align right",
              perform: (e) => e.applySurround('[wrap="right"]\n', "\n[/wrap]", "right"),
            },
            {
              id: "align_justify_role_button",
              group: "extras",
              icon: "align-justify",
              title: "Justify",
              perform: (e) => e.applySurround('[wrap="justify"]\n', "\n[/wrap]", "justify"),
            },
          ];

          // Add the defined buttons to the toolbar
          buttons.forEach((button) => toolbar.addButton(button));

          // Add popup‑menu options (highlight, columns, float‑left) like MD Composer Extras
          api.addComposerToolbarPopupMenuOption({
            action: (e) => e.applySurround("<mark>", "</mark>", "highlight"),
            icon: "highlighter",
            label: "Highlight",
            shortcut: "H",
          });

          api.addComposerToolbarPopupMenuOption({
            action: (e) => e.applySurround('[wrap="columns"]\n', "\n[/wrap]", "columns"),
            icon: "table-columns",
              label: "Columns",
          });

          api.addComposerToolbarPopupMenuOption({
            action: (e) => e.applySurround('[wrap="floatl"]\n', "\n[/wrap]", "floatl"),
            icon: "indent",
            label: "Float left",
          });
        }
      });
    });
  },
};
