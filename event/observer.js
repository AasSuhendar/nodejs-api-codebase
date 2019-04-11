const consumerEventHandler = require('../controllers/consumer')

const init = () => {
    console.log('Observer running');
    initEventListener();
};
const initEventListener = async () => {
    try {
        await consumerEventHandler.consumerEvent()
        // await consumerEventHandler.consumerEventNotif()
    } catch (err) {
        console.log(err)
    }
};

module.exports = {
    init: init
};