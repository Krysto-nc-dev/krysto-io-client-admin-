import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import fr from 'vuetify/es5/locale/fr'


Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {
        fr,
        },
        current: 'fr',
    },
    theme: {
        dark: false,
        themes: {
            light: {
                background: colors.grey.lighten3,
                primary: colors.blue,
                secondary: "#4bb39a",
                accent: colors.shades.black,
                error: colors.red.accent3,
                
                admin_background: colors.grey.lighten3,
                admin_primary: colors.blue,
                admin_secondary: colors.indigo.lighten1,
                admin_accent: colors.shades.black,
                admin_error: colors.red.accent3,
            },
            dark: {
                background: colors.grey.darken4,
                primary: colors.blue,
                secondary: "#4bb39a",
                accent: colors.shades.black,
                error: colors.red.accent3,

                admin_background: colors.grey.darken4,
                admin_primary: colors.blue,
                admin_secondary: colors.indigo.lighten1,
                admin_accent: colors.shades.black,
                admin_error: colors.red.accent3,
            },
        },
    },
    
});
