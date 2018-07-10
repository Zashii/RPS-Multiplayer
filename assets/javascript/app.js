// Initialize Firebase
        var config = {
            apiKey: "AIzaSyAo_0GOYwtPkeFsgtcN5Lm7NDreIsTsH1I",
            authDomain: "rockpaperscissors-7ce7e.firebaseapp.com",
            databaseURL: "https://rockpaperscissors-7ce7e.firebaseio.com",
            projectId: "rockpaperscissors-7ce7e",
            storageBucket: "rockpaperscissors-7ce7e.appspot.com",
            messagingSenderId: "522884865815"
        };
        
        firebase.initializeApp(config);
        database = firebase.database();
        ref = database.ref();

        $(document).ready(function(){

            var p1selected = false;
            var p2selected = false;
            var p1playing = false;
            var p2playing = false;
            var selectedName;
            var p1scoreOnce = true;
            var p2scoreOnce = true;
            var p1moved = false;
            var p2moved = false;
            var p1move;
            var p2move;
           
            //When the user clicks on the Rock, Scissors, or Paper buttons

            $("#p1r").on("click", function(){
                if (p1playing == true && (p1moved == false)) {
                    p1moved = true;
                    database.ref("player1").set({
                            player1: selectedName,
                            move: "rock"
                    });
                }
            });
            $("#p1s").on("click", function(){
                if (p1playing == true && (p1moved == false)) {
                    p1moved = true;
                    database.ref("player1").set({
                            player1: selectedName,
                            move: "scissors"
                    });
                }
            });
            $("#p1p").on("click", function(){
                if (p1playing == true && (p1moved == false)) {
                    p1moved = true;
                    database.ref("player1").set({
                            player1: selectedName,
                            move: "paper"
                    });
                }
            });

             $("#p2r").on("click", function(){
                if (p2playing == true && (p2moved == false)) {
                    p2moved = true;
                    database.ref("player2").set({
                            player2: selectedName,
                            move: "rock"
                    });
                }
            });
            $("#p2s").on("click", function(){
                if (p2playing == true && (p2moved == false)) {
                    p2moved = true;
                    database.ref("player2").set({
                            player2: selectedName,
                            move: "scissors"
                    });
                }
            });
            $("#p2p").on("click", function(){
                if (p2playing == true && (p2moved == false)) {
                    p2moved = true;
                    database.ref("player2").set({
                            player2: selectedName,
                            move: "paper"
                    });
                }
            });

             //When the user submits his chat message, display it on the text window

            $("#chatsubmit").on("click", function(){
                var chatmsg = $("#chatbox").val();

                if (true){
                    database.ref("chatbox").push({
                            name: selectedName,
                            message: chatmsg
                    });
                }
            });
            
            //When the user enters his name to play (or spectate) the game

            $("#start").on("click", function(){

                selectedName = $("#namer").val();

                //If a name has been entered and the start button is clicked
                if ((selectedName != "") && (selectedName != " ") && (selectedName != "  ") && (selectedName != "   ")){
                    $("#start").hide();
                    $("#namer").hide();

                        //If the first player has not been selected yet, you become the first player
                        if ((p1selected != true)){
                            p1playing = true;
                            $("#p1i").html("You are playing!");
                            $("#intro").html("You are Player 1!");
                            database.ref("player1").set({
                                player1: selectedName
                            });
                            p1selected = true;

                            database.ref("players").once("value", function(snapshot) {
                            
                                if (snapshot.child(selectedName).exists()){
                                
                                } else {
                                    database.ref("players").child(selectedName).set({
                                        name: $("#namer").val(),
                                        win: 0,
                                        loss: 0
                                    });
                                    
                                }
                                

                            });
                            
                        //If the second player has not been selected yet, you become the second player
                        } else if (p2selected != true) {
                            $("#p2i").html("You are playing!");
                            $("#intro").html("You are Player 2!");
                            p2playing = true;

                            database.ref("player2").set({
                                player2: selectedName
                            });
                            p2selected = true;

                            database.ref("players").once("value", function(snapshot) {
                            
                                if (snapshot.child(selectedName).exists()){

                                } else {
                                    database.ref("players").child(selectedName).set({
                                            name: $("#namer").val(),
                                            win: 0,
                                            loss: 0
                                    });

                                }
                            
                            });
                        } else {
                            $("#intro").html("You are spectating!");
                        }
                    };
            });

            //Function that is declared when player 1 wins

            var p1win = function(){
                    p1move = "";
                    p1moved = false;
                    p2move = "";
                    p2moved = false;
                    $("#result").html("Player 1 wins!");
                    setTimeout(function(){
                        database.ref("player1").once("value", function(snapshot) {
                            database.ref("player1").set({
                                player1: snapshot.val().player1,
                                move: null
                            });
                            database.ref("players").once("value", function(snapshot2) {
                                var winCount = parseInt(snapshot2.child(snapshot.val().player1).val().win) + 1;
                                database.ref("players").child(snapshot.val().player1).set({
                                    name: snapshot.val().player1,
                                    win: winCount,
                                    loss: snapshot2.child(snapshot.val().player1).val().loss
                                });

                                $("#p1wr").html(" <p>Wins: " + winCount + "</p><p> Losses: " + snapshot2.child(snapshot.val().player1).val().loss + "</p>");

                            });
                        });
                            
                        $(".p1img").remove();
                        $("#result").html("");
                    }, 2000);
                    setTimeout(function(){
                        database.ref("player2").once("value", function(snapshot) {
                            database.ref("player2").set({
                                player2: snapshot.val().player2,
                                move: null
                            });
                            database.ref("players").once("value", function(snapshot2) {
                                var lossCount = parseInt(snapshot2.child(snapshot.val().player2).val().loss) + 1;
                                database.ref("players").child(snapshot.val().player2).set({
                                    name: snapshot.val().player2,
                                    win: snapshot2.child(snapshot.val().player2).val().win,
                                    loss: lossCount
                                });

                                $("#p2wr").html(" <p>Wins: " + snapshot2.child(snapshot.val().player2).val().win + "</p><p> Losses: " + lossCount + "</p>");

                            });
                        });
                            
                        $(".p2img").remove();
                        $("#result").html("");
                            
                    }, 2000);
                    $("#result").html("Player 1 wins!");
            };

            //Function that is declared on a draw

            var draw = function(){
                p1move = "";
                p1moved = false;
                p2move = "";
                p2moved = false;
                $("#result").html("Draw!");
                setTimeout(function(){
                    database.ref("player1").once("value", function(snapshot) {
                        database.ref("player1").set({
                            player1: snapshot.val().player1,
                            move: null
                        });
                        database.ref("players").once("value", function(snapshot2) {
                            var winCount = parseInt(snapshot2.child(snapshot.val().player1).val().win);
                            database.ref("players").child(snapshot.val().player1).set({
                                name: snapshot.val().player1,
                                win: winCount,
                                loss: snapshot2.child(snapshot.val().player1).val().loss
                            });

                            $("#p1wr").html(" <p>Wins: " + winCount + "</p><p> Losses: " + snapshot2.child(snapshot.val().player1).val().loss + "</p>");

                        });
                    });
                            
                    $(".p1img").remove();
                    $("#result").html("");
                }, 2000);
                setTimeout(function(){
                    database.ref("player2").once("value", function(snapshot) {
                        database.ref("player2").set({
                            player2: snapshot.val().player2,
                            move: null
                        });
                        database.ref("players").once("value", function(snapshot2) {
                            var lossCount = parseInt(snapshot2.child(snapshot.val().player2).val().loss);
                            database.ref("players").child(snapshot.val().player2).set({
                                name: snapshot.val().player2,
                                win: snapshot2.child(snapshot.val().player2).val().win,
                                loss: lossCount
                            });

                            $("#p2wr").html(" <p>Wins: " + snapshot2.child(snapshot.val().player2).val().win + "</p><p> Losses: " + lossCount + "</p>");

                        });
                    });
                            
                    $(".p2img").remove();
                    $("#result").html("");
                            
                }, 2000);                
            }

            //Function that is declared when player 2 wins

            var p2win = function(){
                p1move = "";
                p1moved = false;
                p2move = "";
                p2moved = false;
                $("#result").html("Player 2 wins!");
                setTimeout(function(){
                    database.ref("player1").once("value", function(snapshot) {
                        database.ref("player1").set({
                            player1: snapshot.val().player1,
                            move: null
                        });
                        database.ref("players").once("value", function(snapshot2) {
                            var lossCount = parseInt(snapshot2.child(snapshot.val().player1).val().loss) + 1;
                            database.ref("players").child(snapshot.val().player1).set({
                                name: snapshot.val().player1,
                                win: snapshot2.child(snapshot.val().player1).val().win,
                                loss: lossCount,
                            });

                            $("#p1wr").html(" <p>Wins: " + snapshot2.child(snapshot.val().player1).val().win + "</p><p> Losses: " + lossCount + "</p>");

                        });
                    });
                            
                    $(".p1img").remove();
                    $("#result").html("");
                }, 2000);
                setTimeout(function(){
                    database.ref("player2").once("value", function(snapshot) {
                        database.ref("player2").set({
                            player2: snapshot.val().player2,
                            move: null
                        });
                        database.ref("players").once("value", function(snapshot2) {

                                    
                            var winCount = parseInt(snapshot2.child(snapshot.val().player2).val().win) + 1;
                            database.ref("players").child(snapshot.val().player2).set({
                                name: snapshot.val().player2,
                                win: winCount,
                                loss: snapshot2.child(snapshot.val().player2).val().loss
                            });

                            $("#p2wr").html(" <p>Wins: " + winCount + "</p><p> Losses: " + snapshot2.child(snapshot.val().player2).val().loss + "</p>");

                        });
                    });
                            
                    $(".p2img").remove();
                    $("#result").html("");
                            
                }, 2000);
            }

            //Updating the chatbox with database

            database.ref("chatbox").on("child_added", function(snapshot) {

                    if (snapshot.exists()){
                        $(".chatbox").prepend("<p>"+ snapshot.val().name + ": " + snapshot.val().message + "</p>");
                    }

            });

            //Updating player 1's stats from the database

            database.ref("player1").on("value", function(snapshot) {
                 
                 var val = snapshot.val();
                
                 //If a new player 1 shows up or if an existing player 1's win/loss record changes
                 if (snapshot.child("player1").exists()){
                    if (p1playing == false) {
                        $("#p1i").html(" Someone else is playing");
                    };

                    $("#p1name").html("<h2>" + val.player1 + "</h2>");

                    p1selected = true;
                    database.ref("players").once("value", function(snapshot) {
                        if (snapshot.child(val.player1).exists() && (p1scoreOnce == true)) {
                            p1scoreOnce = false;
                            $("#p1wr").html(" <p>Wins: " + snapshot.child(val.player1).val().win + "</p><p> Losses: " + snapshot.child(val.player1).val().loss + "</p>");
                        } else if (p1scoreOnce == true) {
                            p1scoreOnce = false;
                            $("#p1wr").html("<p>Wins: " + "0" + "</p><p> Losses: " + "0" + "</p>");
                        }
                    });

                //If there's no player 1
                 } else if (snapshot.child("player1").exists()==false)  {
                    $("#p1i").html("Waiting for Player 1");
                    $("#p1name").html("");
                    $("#p1wr").html("");
                    p1scoreOnce = true;
                 }
                
                 //If player 1 has made his move
                 if (snapshot.child("move").exists()){
                    p1moved = true;
                    p1move = snapshot.val().move;
                    $("#p1").append("<img class=\"p1img\" src=\"assets/images/" + snapshot.val().move + ".png\" style=\"width: 150px; margin-top:40px\">");
                    if (!p1playing){
                        $("#p1i").html("Player 1 has made its move, waiting on Player 2");
                        $(".p1img").addClass("tempHidden");
                    }
                 }

                //If both players have made their moves, resolve the game
                if (p1moved && p2moved){

                    $(".p1img").removeClass("tempHidden");
                    $(".p2img").removeClass("tempHidden");

                    if (p1move == "rock" && p2move == "scissors"){
                        p1win();
                    }
                    if (p1move == "scissors" && p2move == "paper"){
                        p1win(); 
                    }
                    if (p1move == "paper" && p2move == "rock"){
                        p1win();
                    }
                    if (p1move == "rock" && p2move == "rock"){
                        draw();
                    }
                    if (p1move == "scissors" && p2move == "scissors"){
                        draw();
                    }
                    if (p1move == "paper" && p2move == "paper"){
                        draw();
                    }
                    if (p1move == "rock" && p2move == "paper"){
                        p2win();
                    }
                    if (p1move == "scissors" && p2move == "rock"){
                        p2win();
                    }
                    if (p1move == "paper" && p2move == "scissors"){
                        p2win();
                    }

                }

             });

            //Updating player 2's stats from the database

             database.ref("player2").on("value", function(snapshot) {
                
                 var val = snapshot.val();

                 //If a new player 2 shows up or if an existing player 2's win/loss record changes
                 if (snapshot.child("player2").exists()){
                    if (p2playing == false) {
                        $("#p2i").html(" Someone else is playing");
                    };

                    $("#p2name").html("<h2>" + val.player2 + "</h2>");

                    p2selected = true;
                    database.ref("players").once("value", function(snapshot) {
                        if (snapshot.child(val.player2).exists() && (p2scoreOnce == true)) {
                            p2scoreOnce = false;
                            $("#p2wr").html(" <p>Wins: " + snapshot.child(val.player2).val().win + "</p><p> Losses: " + snapshot.child(val.player2).val().loss + "</p>");
                        } else if (p2scoreOnce == true) {
                            p2scoreOnce = false;
                            $("#p2wr").html("<p>Wins: " + "0" + "</p><p> Losses: " + "0" + "</p>");
                        }                
                    });

                 //If there's no player 2
                 } else if (snapshot.child("player2").exists()==false) {
                    $("#p2i").html("Waiting for Player 2");      
                    $("#p2name").html("");          
                    $("#p2wr").html("");
                    p2scoreOnce = true;
                 }

                //If player 2 has made his move
                if (snapshot.child("move").exists()){
                    p2moved = true;
                    p2move = snapshot.val().move;
                    $("#p2").append("<img class=\"p2img\" src=\"assets/images/" + snapshot.val().move + ".png\" style=\"width: 150px; margin-top:40px\">");
                    if (!p2playing){
                        $("#p2i").html("Player 2 has made its move, waiting on Player 1");
                        $(".p2img").addClass("tempHidden");
                    }
                }

                //If both players have made their moves, resolve the game
                if (p1moved && p2moved){
         
                    $(".p1img").removeClass("tempHidden");
                    $(".p2img").removeClass("tempHidden");

                    if (p1move == "rock" && p2move == "scissors"){
                        p1win();
                    }
                    if (p1move == "scissors" && p2move == "paper"){
                        p1win(); 
                    }
                    if (p1move == "paper" && p2move == "rock"){
                        p1win();
                    }
                    if (p1move == "rock" && p2move == "rock"){
                        draw();
                    }
                    if (p1move == "scissors" && p2move == "scissors"){
                        draw();
                    }
                    if (p1move == "paper" && p2move == "paper"){
                        draw();
                    }
                    if (p1move == "rock" && p2move == "paper"){
                        p2win();
                    }
                    if (p1move == "scissors" && p2move == "rock"){
                        p2win();
                    }
                    if (p1move == "paper" && p2move == "scissors"){
                        p2win();
                    }
               }
             });

            //Function that is called when a player that has been actively playing leaves the game (closing the window, refreshing, etc.)

             var clean = function(){
                if (p1playing){
                     database.ref("player1").set({
                         player1: null
                     });
                 } else if (p2playing) {
                     database.ref("player2").set({
                         player2: null
                     });
                 }
             }

             
            //EventListener that is called when a player that has been actively playing leaves the game (closing the window, refreshing, etc.)

            $(window).on("beforeunload", function() { 
                 return clean(); 
            });

        });

    