var app = angular.module("fireChat", ["firebase"])
  .constant('_', window._)
var userKey = 'user_1'
// var _ = require('lodash');
var myEl = angular.element( document.querySelector( '#divID' ) );

app.controller("ChatCtrl", function($scope, $firebaseArray, $firebaseObject, _) {
  var ref = firebase.database().ref();
  $scope.threads = [];
  $scope.messages = [];

  $scope.callThreadFactory = (child) => {
    console.log(child);
      if(child.event == 'child_removed'){
        $scope.threads = _.reject($scope.threads, { $id: `${child.key}` });    
      }else if(child.event == 'child_added'){
        $firebaseObject(ref.child(`threads/${child.key}`)).$loaded()
        .then(function(thread) {
          console.log(thread)
          $scope.threads.push(thread);
          // $scope.thread = thread;
        }) 
      }
  }
  $scope.addToMessageQueue = (child) =>{
    console.log(child)
    if(child.event == 'child_removed'){
      $scope.threads = _.reject($scope.messages, { $id: `${child.key}` });    
    }else if(child.event == 'child_added'){
      $firebaseObject(ref.child(`messages/${$scope.threadId}/${child.key}`))
      .$loaded()
        .then(function(msg){      
          console.log(msg);
          $scope.messages.push(msg)
        })
    }
    
  }
  $scope.addToMembersQueue = (child) =>{
    console.log(child)
  }
  
  $scope.user = $firebaseArray(ref.child(`users/${userKey}/threads`))
  $scope.user.$watch($scope.callThreadFactory);

  $scope.getMessages = (id) => {
    $scope.threadId = id;
    if(angular.isDefined($scope.activeThreadMessages)) 
        {
          $scope.activeThreadMessages.$destroy();
          $scope.activeThreadMembers.$destroy();
        } 
          
    $scope.messages = [];
    $scope.members = [];
    $scope.activeThreadMessages = $firebaseArray(ref.child(`messages/${id}`));
    $scope.activeThreadMembers = $firebaseArray(ref.child(`members/${id}`));

    $scope.activeThreadMessages.$loaded().then(function(messages){
      //console.log(messages);
      _.forEach(messages, (message) => {
        if(message.created_by == userKey) message.isMyComment = true;
        console.log(message);
        $scope.messages.push(message);
      }); 
    }).then(function(){
      $scope.activeThreadMessages.$watch($scope.addToMessageQueue);
    })

    $scope.activeThreadMembers.$loaded().then(function(members){
      //console.log(messages);
      $scope.members = members;
    }).then(function(){
      $scope.activeThreadMembers.$watch($scope.addToMembersQueue);
    })
  }

})