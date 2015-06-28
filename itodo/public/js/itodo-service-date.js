var itodoDateService = angular.module('itodo.service.date', []);
itodoDateService.factory('dateService', function() {
	
	var DEFAULT_M = 10; // TODO set default value, 10 minutes later.
	
	return {
		getDefaultDate : function() {
			var m = moment().add(DEFAULT_M, 'm'), date = {};
			date.year = m.year();
			date.month = m.month() + 1;
			date.day = m.date();
			date.hour = m.hour();
			date.minute = m.minute();
			date.second = 0;
			return date;
		},
		
		computeDuration : function(startDate, deadline) {
			var duration = null;
			
			if(startDate) {
				
				var date = startDate.year + '-' + startDate.month + '-' + startDate.day + ' ' + startDate.hour + ':' + startDate.minute + ':' + startDate.second;
				startDate = moment(date, 'YYYY-MM-DD HH:mm:ss');
				
				if(deadline && deadline.year && deadline.month && deadline.day) {
					date = deadline.year + '-' + deadline.month + '-' + deadline.day + ' ' + deadline.hour + ':' + deadline.minute + ':' + deadline.second;
					deadline = moment(date, 'YYYY-MM-DD HH:mm:ss');
					
					var tmpDuration = moment.duration({from : startDate, to : deadline});
					duration = {};
					duration.Y = tmpDuration.years();
					duration.M = tmpDuration.months();
					duration.D = tmpDuration.days();
					duration.h = tmpDuration.hours();
					duration.m = tmpDuration.minutes();
					duration.s = tmpDuration.seconds();
				}
			}
			
			return duration;
		},
		
		getDurationDesc : function(startDate, deadline) {
			var duration = null;
			
			if(startDate) {
				
				var date = startDate.year + '-' + startDate.month + '-' + startDate.day + ' ' + startDate.hour + ':' + startDate.minute + ':' + startDate.second;
				startDate = moment(date, 'YYYY-MM-DD HH:mm:ss');
				
				if(deadline && deadline.year && deadline.month && deadline.day) {
					date = deadline.year + '-' + deadline.month + '-' + deadline.day + ' ' + deadline.hour + ':' + deadline.minute + ':' + deadline.second;
					deadline = moment(date, 'YYYY-MM-DD HH:mm:ss');
					
					duration = deadline.from(startDate, false);
				}
			}
			
			return duration;
		}
	};
	
});

//@ sourceURL=itodo-service-date.js