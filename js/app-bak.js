
var app = angular.module("fireChat", ["firebase"]);
app.controller("ChatCtrl", function($scope, $firebaseArray) {
  var ref = firebase.database().ref();
  // download the data into a local object
  $scope.proposals = $firebaseArray(ref);
    /*  // Once
        $scope.data.$loaded()
        .then(function(){
            console.log($scope.data);
        }) 
    */
    $scope.showPreviewZone = false;
    $scope.messageList = document.getElementById('messages');
    $scope.messageInput = document.getElementById('message');
    $scope.storage = firebase.storage();
    // A loading image URL.
    $scope.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';    
    // Template for thumb
    $scope.ATTACHMENT_THUMB = `
        <div class="media-thumb stagger-delay active" style="opacity: 1; display: block; transform: scaleX(1) scaleY(1); transform-origin: 50% 50% 0px; position:relative;">
            <a data-dz-remove class="btn-floating btn waves-effect waves-light red thm-btn-close" style="position: absolute;width: 20px;height: 20px;line-height: 20px;left:7px; top:1px;"><i class="tiny material-icons" style="font-size: 1rem;line-height:7px;">close</i></a>
            <div class="media-thumb-body"><img data-dz-thumbnail/></div>
        </div>`
    // Template for messages.
    $scope.MESSAGE_TEMPLATE =
        '<div class="message-container">' +
        '<div class="spacing"><div class="pic"></div></div>' +
        '<div class="message"></div>' +
        '<div class="name"></div>' +
        '</div>';
    $scope.displayMessage = function(key, name, text, picUrl, imageUri) {
        var div = document.getElementById(key);
        // If an element for that message does not exists yet we create it.
        if (!div) {
            var container = document.createElement('div');
            container.innerHTML = $scope.MESSAGE_TEMPLATE;
            div = container.firstChild;
            div.setAttribute('id', key);
            this.messageList.appendChild(div);
        }
        if (picUrl) {
            div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
        }
        div.querySelector('.name').textContent = name;
        var messageElement = div.querySelector('.message');
        if (text) { // If the message is text.
            messageElement.textContent = text;
            // Replace all line breaks by <br>.
            messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
        } else if (imageUri) { // If the message is an image.
            var image = document.createElement('img');
            image.addEventListener('load', function() {
            this.messageList.scrollTop = this.messageList.scrollHeight;
            }.bind(this));
            this.setImageUrl(imageUri, image);
            messageElement.innerHTML = '';
            messageElement.appendChild(image);
        }
        // Show the card fading-in and scroll to view the new message.
        setTimeout(function() {div.classList.add('visible')}, 1);
        this.messageList.scrollTop = this.messageList.scrollHeight;
        this.messageInput.focus();
    }
    // Loads chat messages history and listens for upcoming ones.
    $scope.loadMessages = function() {
        // Reference to the /messages/ database path.
        this.messagesRef = firebase.database().ref('messages');
        // Make sure we remove all previous listeners.
        this.messagesRef.off();

        // Loads the last 12 messages and listen for new ones.
        var setMessage = function(data) {
            var val = data.val();
            this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
        }.bind(this);
        this.messagesRef.limitToLast(12).on('child_added', setMessage);
        this.messagesRef.limitToLast(12).on('child_changed', setMessage);
    };

    // Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
    $scope.setImageUrl = function(imageUri, imgElement) {
    // If the image is a Firebase Storage URI we fetch the URL.
    if (imageUri.startsWith('gs://')) {
        imgElement.src = this.LOADING_IMAGE_URL; // Display a loading image first.
        this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
        imgElement.src = metadata.downloadURLs[0];
        });
    } else {
        imgElement.src = imageUri;
    }
    };

    $scope.showDropZone = function(){
        console.log(123)
        // $scope.myDropzone = new Dropzone("div#messages-card", { url: "/file/post"});
        alert("Hello");
    }

    $scope.dropzone = new Dropzone(document.body, { // Make the whole body a dropzone
        url: "/", // Set the url
        autoProcessQueue: false,
        previewsContainer: "#fileList", // Define the container to display the previews
        clickable: "#image-form", // Define the element that should be used as click trigger to select files.
        previewTemplate: $scope.ATTACHMENT_THUMB
      });
    
      $scope.dropzone.on("addedfile", function(file) {
        /* Maybe display some more file information on your page */
        $scope.$apply(function(){
            $scope.showPreviewZone = true;
        })
      });
    /* $scope.$watch('proposals',function() {
        console.log($scope.proposals);
        $scope.proposals.forEach(proposal =>{

        })  
    }, true) */

    /* ref.on("value", function(snapshot) {
        $scope.$apply(function() {
            $scope.data = snapshot.val(); 
            console.log($scope.data);
        });
    }); */
     /* var ref = firebase.database().ref(); // assume value here is { foo: "bar" }
    var obj = $firebaseObject(ref);

    obj.$bindTo($scope, "data").then(function() {
        console.log($scope.data); // { foo: "bar" }
        $scope.data.foo = "baz";  // will be saved to the database
        //ref.set({ foo: "baz" });  // this would update the database and $scope.data
    }); */
    
});
//console.log(app);