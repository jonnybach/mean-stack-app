angular.module('myApp').controller('MainController', MainController).controller('AboutController', AboutController);

function MainController($http) {
    var vm = this;
    vm.name = 'Jonny';

    $http.get('http://swapi-tpiros.rhcloud.com/films').then( function(response) {
        console.log(response);
    });

}

function AboutController() {
    var vm = this;
    vm.about = 'This is my bio';
}
