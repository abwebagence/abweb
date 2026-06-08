
    jQuery(function($) {

        $('#interactive-navigation').slick({
            dots: false,
            draggable: false,
            swipe: false,
            touchMove: false,
            arrows: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
            adaptiveHeight: false,
            cssEase: 'ease-out',
            autoplay: false
        });

        var questions = {
            "first": {
                "question": "Welcome to our intelligent AI question / answer system! We custom coded this for Boomerang - you can give it a try here. Type ENTER to get started!",
                "accept": [
                "enter", 
                "hello", 
                "hi"
                ],
                "final": false
            },
            "hello": {
                "question": "Are we the web agency you're looking for? Reply YES / NO",
                "accept": [
                "yes",
                "no"
                ],
                "final": false
            },
            "hi": {
                "question": "Are we the web agency you're looking for? Reply YES / NO",
                "accept": [
                "yes",
                "no"
                ],
                "final": false
            },
            "enter": {
                "question": "Are we the web agency you're looking for? Reply YES / NO",
                "accept": [
                "yes",
                "no"
                ],
                "final": false
            },
            "yes": {
                "question": "Thanks - you're right, of course! What sort of website are you after? Reply E-COMMERCE / STANDARD",
                "accept": [
                "e-commerce",
                "standard"
                ],
                "final": false
            },
            "no": {
                "question": "Aw, man! Let us persuade you. Check out our <a target=\"_blank\" href=\"https://cbwebsitedesign.co.uk/portfolio\">other projects</a>. Reply OK / NO WAY",
                "accept": [
                "ok",
                "no way"
                ],
                "final": false
            },
            "ok": {
                "question": "Great - we hope you like what you see! If you have questions, feel free to <a target=\"_blank\" href=\"https://cbwebsitedesign.co.uk/contact\">contact us.</a>. Reply THANKS",
                "accept": [
                "thanks"
                ],
                "final": false
            },
            "no way": {
                "question": "😮... Meanie! Our collective hearts ache. 💔 We hope you'll reconsider, but for now - farewell, my friend. Reply DONE",
                "accept": [
                "done"
                ],
                "final": false
            },
            "e-commerce": {
                "question": "Time to start raking in those sales! <a target=\"_blank\" href=\"https://www.cbwebsitedesign.co.uk/portfolio/gibraltar-nature-reserve/\">Here's a project</a> you might be interested to see. Reply THANKS",
                "accept": [
                "thanks"
                ],
                "final": false
            },
            "standard": {
                "question": "It's ok - standard doesn't mean boring! We're experts in awesome sites, like <a target=\"_blank\" href=\"https://www.cbwebsitedesign.co.uk/portfolio/recharge/\">this one.</a> Have a browse! Reply THANKS",
                "accept": [
                "thanks"
                ],
                "final": false
            },
            "thanks": {
                "question": "No problem! Ready to get started on your own project? Reply GO / NOT YET",
                "accept": [
                "go",
                "not yet"
                ],
                "final": false
            },
            "go": {
                "question": "Excellent! We look forward to hearing from you. Just <a target=\"_blank\" href=\"https://cbwebsitedesign.co.uk/contact\">let us know what you need</a>! Reply DONE",
                "accept": [
                "done"
                ],
                "final": false
            },
            "not yet": {
                "question": "That's ok! We're here whenever you need us. In the meantime you could check out our <a target=\"_blank\" href=\"https://cbwebsitedesign.co.uk/portfolio\">other projects</a> for some inspiration. Reply DONE",
                "accept": [
                "done"
                ],
                "final": false
            },
            "done": {
                "question": "Messaging Link Terminated",
                "accept": [],
                "final": true
            }
        }

        //set a counter to keep track of what question we are on
	var current = 'first';

function bounceIn(chatBox) {
    let element = document.querySelector(chatBox);
    if (!element) return;

    element.animate([
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.1)", opacity: 1, offset: 0.6 },
        { transform: "scale(0.95)", opacity: 1, offset: 0.8 },
        { transform: "scale(1)", opacity: 1 }
    ], {
        duration: 1000,
        easing: "ease-out",
        fill: "forwards"
    });
}

    function scrollView() {
        document.querySelectorAll('.message-view').forEach(container => {
            let scrollHeight = Math.max(container.scrollHeight, container.clientHeight);
            let newScroll = scrollHeight - container.clientHeight;
    
            container.scrollTo({
                top: newScroll * 2,
                behavior: "smooth"
            });
        });
    }


    function loadQuestion(input) {
        //clear animate class from them all
        $('.single-bubble').removeClass('animate');

        //grab the question from the i'th position in array

        if (input == 1) {
            input = 'one';
        } else if (input == 2) {
            input = 'two';
        } else if (input == 3) {
            input = 'three';
        } else if (input == 4) {
            input = 'four';
        } else if (input == 5) {
            input = 'five';
        } else if (input == 6) {
            input = 'six';
        } else if (input == 7) {
            input = 'seven';
        } else if (input == 8) {
            input = 'eight';
        } else if (input == 9) {
            input = 'nine';
        } else if (input == 10) {
            input = 'ten';
        } else if (input == 11) {
            input = 'eleven';
        } else if (input == 12) {
            input = 'twelve';
        } else if (input == 13) {
            input = 'thirteen';
        }

        var toLoad = questions[input].question;

        //and load it into the frontend
        $('.message-view').append('<div class="single-bubble question animate"><p>' + toLoad + '</p></div>');

        bounceIn('.animate');

        scrollView();

    }

    function loadError() {
        //clear animate class from them all
        $('.single-bubble').removeClass('animate');

        //they put in an unaccepted answer, so load some generic error text
        $('.message-view').append("<div class='single-bubble error animate'><p>Sorry, that answer wasn't recognised. ☹️ Please try again!</p></div>");

        bounceIn('.animate');

        scrollView();

    }

    function loadResponse(input) {
        //clear animate class from them all
        $('.single-bubble').removeClass('animate');

        //load the user's input into the frontend as an answer
        $('.message-view').append('<div class="single-bubble answer animate"><p>' + input + '</p></div>');
        
        //update current item
        current = input;
        
        if (current == 1) {
            current = 'one';
        } else if (current == 2) {
            current = 'two';
        } else if (current == 3) {
            current = 'three';
        } else if (current == 4) {
            current = 'four';
        } else if (current == 5) {
            current = 'five';
        } else if (current == 6) {
            current = 'six';
        } else if (current == 7) {
            current = 'seven';
        } else if (current == 8) {
            current = 'eight';
        } else if (current == 9) {
            current = 'nine';
        } else if (current == 10) {
            current = 'ten';
        } else if (current == 11) {
            current = 'eleven';
        } else if (current == 12) {
            current = 'twelve';
        } else if (current == 13) {
            current = 'thirteen';
        }

        bounceIn('.animate');

        scrollView();

    }

    function loadFinal() {
        //clear animate class from them all
        $('.single-bubble').removeClass('animate');

        //load the final ending message with a prompt to restart by tapping
        $('.message-view').append('<div class="single-bubble final animate"><p>Thanks for trying our interactive AI! This is the same system we custom coded from scratch for Boomerang. Tap this message to start again, or read more below.</p></div>');

        bounceIn('.animate');

        scrollView();

    }

    function resetFocus() {

        //clear the input value and focus back on it for typing
        $('#entry').val('');
        document.getElementById('entry').focus();

    }

    //so then if they tap the final one then revert to the beginning
    $(document).on('click touch', '.single-bubble.final', function () {
        //first fade out the messages gracefully
        TweenLite.to('.single-bubble', 0.6, {
            opacity: 0,
            onComplete: function () {
                //once they are gone, empty the container
                $('.message-view').empty();

                //slide the nav back to beginning
                $('#interactive-navigation').slick('slickGoTo', 0);

                //and also show the first one again so reset i
                current = 'first';
                loadQuestion(current);
                
                document.getElementById('entry').disabled = false;
                resetFocus();
            }
        });

    });

    //run the load function on page load so it shows the first question
    loadQuestion('first');

    function checkResponse(array, current, value) {

        //this will return true if the answer is found (accepted) and false if it isn't
        return array[current].accept.indexOf(value) > -1;

    }

    //handle what happens when they press send
    $('#interactive-form').submit(function (e) {

        var form = document.getElementById('interactive-form');

        if (!form.checkValidity()) {
            //the input is blank so just do nothing, this is using bootstrap validation
            e.preventDefault();
            e.stopPropagation();

        } else {
            //they have put some text in so let's begin
            e.preventDefault();

            //we also need to do some custom validation against expected inputs
            //get form input text
            var input = document.getElementById('entry').value.toLowerCase();

            //check if it's an accepted answer of the question we are on
            var checkedResponse = checkResponse(questions, current, input);

            if (!checkedResponse) {
                //no it isn't so show an error				
                loadError();

                //clear the input and refocus the input form
                resetFocus();

            } else {
                //this is the answer we're looking for so load it in
                loadResponse(input);

                //also advance the nav slider at the bottom
                var targetSlide = $('#interactive-navigation [data-step="' + current + '"]').parents('.slick-slide').data('slick-index');
                $('#interactive-navigation').slick('slickGoTo', targetSlide);

                //delay loading the next prompt by a little bit so it looks like stuff is happening
                setTimeout(function () {

                    if (questions[current].final) {
                        //if we've reached the end, output the last prompt, followed by an ending message with revert link
                        loadQuestion(input);

                        setTimeout(function () {
                            loadFinal();
                        }, 300);
                        
                        document.getElementById('entry').disabled = true;
                        TweenLite.to('#typing', 0.3, {
                            opacity: 0
                        });

                    } else {
                        //if there are more questions, load the next one
                        loadQuestion(input);
                    }

                    //clear the input and refocus the input form
                    resetFocus();

                }, 800);


            }

        }
        $(form).addClass('was-validated');

    });

    var typeEllipsis = document.getElementById('typing');

	function loadEllipsis(typeEllipsis) {
	    
    var siteURL = window.location.origin; // Gets the base URL dynamically

		if (/Edge/.test(navigator.userAgent)) {
			$('.typing').addClass('edgetown');
		} else {
			//lottie
			var ellipsisAnimation = bodymovin.loadAnimation({
				container: typeEllipsis,
				renderer: 'svg',
				loop: true,
				autoplay: false,
				path: siteURL + '/wp-content/themes/cbd/page-templates/boomerang-messaging/typing.json' // ✅ Dynamic Path
			});
		}
		
$('#entry').on('focus', function() {
    $('#typing').css({
        'transition': 'opacity 0.3s ease-in-out',
        'opacity': '1'
    });

    ellipsisAnimation.setSpeed(1.2);
    ellipsisAnimation.play();
}).on('blur', function() {
    $('#typing').css({
        'transition': 'opacity 0.3s ease-in-out',
        'opacity': '0'
    });

    ellipsisAnimation.goToAndStop(ellipsisAnimation.firstFrame);
});


	}
	
	loadEllipsis(typeEllipsis);

});
