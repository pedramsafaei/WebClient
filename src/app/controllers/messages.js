angular.module("proton.Controllers.Messages", [
  "proton.Routes"
])

.controller("MessageListController", function($state, $stateParams, $scope, $rootScope, messages) {
  $rootScope.pageName = $state.current.data.mailbox;

  $scope.messages = messages;
  $scope.navigateToMessage = function (event, message) {
    if (!$(event.target).closest("td").hasClass("actions")) {
      $state.go("secured.message", { MessageID: message.MessageID });
    }
  };
})

.controller("ComposeMessageController", function($rootScope, $scope, Message) {
  $rootScope.pageName = "New Message";
  $scope.message = new Message();
})

.controller("ViewMessageController", function($rootScope, $scope, message) {
  $rootScope.pageName = message.MessageTitle;
  $scope.message = message;
});
