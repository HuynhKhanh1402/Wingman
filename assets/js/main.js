'use strict';


$(window).on('load', function() {
	/*------------------
		Preloder
	--------------------*/
	$(".loader").fadeOut(); 
	$("#preloder").delay(400).fadeOut("slow");

});

(function($) {

	/*------------------
		Navigation
	--------------------*/
	$('.nav-switch').on('click', function(event) {
		$('.main-menu').slideToggle(400);
		event.preventDefault();
	});


	/*------------------
		Background Set
	--------------------*/
	$('.set-bg').each(function() {
		var bg = $(this).data('setbg');
		$(this).css('background-image', 'url(' + bg + ')');
	});


	/*------------------
		Hero Slider
	--------------------*/
	$('.hero-slider').owlCarousel({
		loop: true,
		nav: false,
		dots: true,
		mouseDrag: false,
		animateOut: 'fadeOut',
    	animateIn: 'fadeIn',
		items: 1,
		autoplay: true
	});
	var dot = $('.hero-slider .owl-dot');
	dot.each(function() {
		var index = $(this).index() + 1;
		if(index < 10){
			$(this).html('0').append(index);
			$(this).append('<span>.</span>');
		}else{
			$(this).html(index);
			$(this).append('<span>.</span>');
		}
	});


	/*------------------
		News Ticker
	--------------------*/
	$('.news-ticker').marquee({
	    duration: 10000,
	    //gap in pixels between the tickers
	    //gap: 200,
	    delayBeforeStart: 0,
	    direction: 'left',
	    duplicated: true
	});

	/*------------------
		Scrolling to top
	--------------------*/
	const scrollTopBtn = $('.scrolling-to-top');
	$(window).on('scroll', function(e){
		var position = $(window).scrollTop();
        if (position > 1000) {
			scrollTopBtn.addClass('visible');
		} else {
			scrollTopBtn.removeClass('visible');
		}
	});

	$('#check').change(function() {
		if (this.checked) {
			$('.chat-form-wrapper').css('z-index', 11);
			$('.scrolling-to-top').css('z-index', 9);
		} else {
			$('.chat-form-wrapper').css('z-index', 10);
			$('.scrolling-to-top').css('z-index', 11);
		}
	});

	scrollTopBtn.on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: 0}, 'slow');
	});

	/*------------------
		Register / Login
	--------------------*/
	function register() {
		const username = $('#register-username').val();
		const email = $('#register-email').val();
		const password = $('#register-password').val();
		const confirmPassword = $('#register-re-password').val(); 
	  
		if (username === '' || email === '' || password === '' || confirmPassword === '') {
			alert('Register Failed! All fields are required.');
			return;
		}
		
		if (password !== confirmPassword) {
			alert('Register Failed! Passwords do not match.');
			return;
		}
	
		// Check if email already exists
		if (localStorage.getItem(email)) {
			alert('Register Failed! Email already exists.');
			return;
		}
	
		// Optional: Check if username is unique (if needed)
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const user = JSON.parse(localStorage.getItem(key));
			if (user.username === username) {
				alert('Register Failed! Username already exists.');
				return;
			}
		}
	
		const user = {
			username: username,
			email: email,
			password: password
		};
	  
		localStorage.setItem(email, JSON.stringify(user));
		alert('Register Successfully!');
		$('#registerModal').modal('hide');
		$('#loginModal').modal('show');
	}
	
	

	function login() {
		const email = $('#login-email').val();
		const password = $('#login-password').val();
		
		if (email === '' || password === '') {
			alert('Login Failed! All fields are required.');
			return;
		}
		
		const user = JSON.parse(localStorage.getItem(email));
		
		if (user && user.password === password) {
			alert('Login Successfully!');
			$('#loginModal').modal('hide');

			localStorage.setItem('loggedInUser', JSON.stringify(user));

			// Thay đổi nội dung của liên kết "Login"
            $('#login-link').text(user.username);
            $('#login-link').removeAttr('data-bs-toggle'); // Xóa thuộc tính data-bs-toggle để không mở modal nữa
            $('#login-link').removeAttr('data-bs-target'); // Xóa thuộc tính data-bs-target để không mở modal nữa
            
            // Ẩn liên kết "Register"
            $('#register-link').hide();

			$('#logout-link').show().text('Logout');
			location.reload();
		} else {
			alert('Login Failed! Incorrect email or password.');
		}

	}

	function logout() {
        localStorage.removeItem('loggedInUser');
        alert('Logout Successfully!');
        // Hiển thị lại liên kết "Login" và "Register", ẩn nút "Logout"
        $('#login-link').show();
        $('#register-link').show();
        $('#logout-link').hide();

		location.reload();
    }

	$(document).ready(function() {
		// Kiểm tra nếu đã có thông tin đăng nhập trong localStorage
		const loggedInUser = localStorage.getItem('loggedInUser');
		
		if (loggedInUser) {
			const user = JSON.parse(loggedInUser);
			// Thay đổi giao diện để hiển thị "Welcome, username"
			$('#login-link').text(user.username);
			$('#login-link').removeAttr('data-bs-toggle'); // Xóa thuộc tính data-bs-toggle để không mở modal nữa
			$('#login-link').removeAttr('data-bs-target'); // Xóa thuộc tính data-bs-target để không mở modal nữa

			// Ẩn liên kết "Register"
			$('#register-link').hide();
			$('.user-panel').css('padding', '0 28px');
			$('#logout-link').show().text('Logout');
		}

		$('.btn-register').on('click', function(e) {
			e.preventDefault();
			register();
		});
	
		// Hàm đăng nhập
		$('.btn-login').on('click', function(e) {
			e.preventDefault();
			login();
		});

		$('#logout-link').on('click', function(e) {
			e.preventDefault();
			logout();
		});
	});

	/*------------------
		Leave message
		URL GOOGLE SHEET:
		https://docs.google.com/spreadsheets/d/1d89RUtjMSjD82OIWzSGg70Cb9ztShCAAwLwDo-YP4Bo/edit#gid=0
	--------------------*/
	function leaveMessage(e) {
        e.preventDefault(); 

        const form = e.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
        })
        .then(res => res.text())
        .then(responseText => {
            alert('Your message has been sent successfully!');
            form.reset();
        })
        .catch(error => {
            alert('There was an error sending your message. Please try again later.');
        });
    };

	$('#contactForm').on('submit', leaveMessage);
	$('#contactForm2').on('submit', leaveMessage);
})(jQuery);





