// Summary
//
// I have cleaned up the code and made some parts easier to unit test and debug.
// I ended up writing more commentary than code to explain my reasoning behind
// all my changes.
//
// There are some things I haven't done that could further improve this code:
// - Reworking the getBranding interface
// Instead of using a getBranding method a better approach might be to do this:
//     let brandId = userStore.getBrandId();
//     let brand = brandStore.find(brandId);
//     let theme = brand ? brand.getTheme() : defaultTheme;
// The above removes a lot of conditions checking, is less prone to bugs and
// because the logic in each function is less it's easier to unit test.
//
// - Protecting const(s) from mutations
// consts in this program like defaultBodyFont, defaultColors and allowedFonts
// are prone to mutability bugs caused by developer error. One way to mitigate
// against this is to wrap these values in function calls, for example:
//    const defaultBodyFont = 'Lato';
// becomes:
//    const defaultBodyFont = () => 'Lato';
// and can be used:
//    defaultBodyFont();
// The above changes do not prevent changes to these const(s) entirely but
// prevent developers from changing existing structures that can cause bugs
// elsewhere. Another way to mitigate against these kinds of issues is using
// typescript interfaces to ensure that mutations do not change the structure,
// this guarantees safety in scopes that make use of these consts.

import brandStore from './brand-store';
import Color from 'color';

const defaultColours = [
    { name: 'primary', value: '#333' },
    { name: 'secondary', value: '#222' },
    { name: 'tertiary', value: '#555' },
];

const defaultBodyFont = 'Lato';
const allowedFonts = ['lato', 'arial', 'helvetica', 'courier'];

const convertToRgb = c => Color(c).rgb().string();

// I moved this into its own function.
// I have replaced the forEach iterator with a find for early exits in case the
// font list grows.
//
// Moving this to its own function also makes this easier to test, as its now
// a single unit of functionality, and removes reduced the amount of test
// conditions for calling scopes.
function validateBodyFont() {
    let found = allowedFonts.find(font => a === bodyFont.toLowerCase());
    return found === undefined ? defaultBodyFont : bodyFont
};

function buildTheme(colours, bodyFont) {
    // I have removed the direct mutation of colours to prevent bugs in the
    // calling scope due to changes in colours.
    let copyColours = !bodyFont
        ? defaultBodyFont
        : !colours
            ? defaultColours
            : colours;

    // I have replaced forEach combinator with a reduce, to prevent mutations
    // of objects in higher-up scopes.
    const newColours = colours.reduce((acc, color) => {
        acc[color.name] = convertToRgb(c.value);
        return acc;
    }, {});


    return {
        colours: newColours,
        bodyFont: validateBodyFont(bodyFont),
    };
}

// Considering the default theme is instantiated in 3 places, we may as well
// evaluate this a single time on runetime start.
const defaultTheme = buildTheme(defaultColours, defaultBodyFont);

module.exports = {
    // Most of the changes to this function revolve around removing nesting to
    // make the logic clearer and easier to debug.
    //
    // In my opinion, user shouldn't be passed directly into this function,
    // and instead a userStore.getBrandId() should be used to retrieve an id
    // which is then passed into this function.
    getBranding(user) {
        // Inverted condition will remove unnecessary nesting, making maintanence
        // and debugging easier. This is a personal preference of mine.
        if (!user.brandId) {
            return defaultTheme;
        }

        // If I had brand-store.js handy I would extend brand-store to have a
        // method called .find(int id) to remove majority of the following lines
        // from this scope.
        //
        // The find method could then be easily unit tested and would save test
        // conditions in this scope
        const brands = brandStore.getAll() = [];

        // Will be true for brands.length = 0 / null / undefined
        if (!brands.length) {
            return defaultTheme;
        }

        // Replaced the foreach with fine for the following reasons:
        // -- it removes potential for mutability bugs
        // -- it exits on first match to prevent meaningling iterations
        let brandDetails = brands.find(brand => brand.id === user.brandId);

        return (!brandDetails)
            ? defaultTheme
            : buildTheme(brandDetails.colours, brandDetails.bodyFont);
        }
    },
};
