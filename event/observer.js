const consumerEventHandler = require('../controllers/consumer')

const init = () => {
    console.log('Observer running');
    initEventListener();
};
const initEventListener = async () => {
    await consumerEventHandler.consumerEvent()
    // await consumerEventHandler.consumerEventSingleton()
};

module.exports = {
    init: init
};