const AccessControl = require('accesscontrol')
const access = new AccessControl();

const roles =(()=>{
    access.grant('student')
    .readOwn('profile')
    .updateOwn('profile')

    access.grant('tutor')
    .extend('student')
    .readAny('profile')

    access.grant('admin')
    .extend('student')
    .extend('tutor')  
    .updateAny('profile')
    .deleteAny('profile')
    
    return access;
})();

module.exports = roles;