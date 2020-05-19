require('normalize.css/normalize.css')
require('../css/main.css')
require('./page.css')

import SceneController from './js/SceneController';

(function main() 
{
  let sceneController = new SceneController();
  sceneController.setup();

  if (module && module.hot) 
  {
    module.hot.dispose(() => {
      if (sceneController) sceneController.dispose();
    });
  }  
})();

