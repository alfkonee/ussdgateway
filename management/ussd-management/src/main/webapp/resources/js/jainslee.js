/*
 * TeleStax, Open Source Cloud Communications
 * Copyright 2013, TeleStax and individual contributors as indicated
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

// --- General Utility Functions ----------------------------------------------

/**
 * Shortens a string to a specific size.
 *
 * @param str the string to be shortened
 * @param begin the amount of chars to keep in the start
 * @param end the amount of chars to keep in the end
 * @return the shortened string, in form <start>..<end>
 */
function shorten(str, begin, end) {
	// check if the string is at least bigger than the short version
	if (!begin || !end || begin + 2 + end >= str.length) {
		return str;
	}

	return str.substring(0, begin) + ".." + str.substring(str.length - end);
}

/**
 * Sets a timer which is automatically cancelled when the specified title text
 * is not found in the displayed page.
 *
 * @param interval the interval at which the timer is set to, in milliseconds
 * @param fn the function to execute
 * @param text the text to find in the page header
 * @return the ID of the set timer
 */
function setAutoCancellableInterval(interval, fn, text) {
	var timerId = setInterval(function() {
		window[fn]();
		// auto-clear the interval if we are not there anymore
		if($("#content").children("h3").text().indexOf(text) < 0) {
			clearInterval(timerId);
		}
	}, interval);
	// execute first time immediately
	window[fn]();

	return timerId;
}

jQuery.fn.random = function() {
	var randomIndex = Math.floor(Math.random() * this.length);
	return jQuery(this[randomIndex]);
};

/**
 * Prepare a Jolokia Batch Request
 *
 *
function prepareBatchRequest() {
	return $.map(monitoredMbeans, function(mbean) {
		switch(mbean.type) {
			case 'read':
				return {
					type: mbean.type,
					opts: mbean.args,
					mbean: mbean.name,
					attribute: mbean.attribute,
					path: mbean.path
				};
			case 'exec':
				return {
					type: mbean.type,
					arguments: mbean.args,
					mbean: mbean.name,
					operation: mbean.operation,
					path: mbean.path
				};
		}
	});
}
 */

function handleError(message, response) {
	errorUID = ("st" + new Date().getTime()).hashCode();
	logToConsole("ERROR", message + " (<a href=\"#" + errorUID + "-modal\" data-toggle=\"modal\">Full Stack Trace</a>)");
	createStackTrace(errorUID, response.stacktrace);
}

// --- Menu Handling Functions ----------------------------------------------

function setMenu(element, module) {
	// set loader
	$('.advertisement').hide();
	$('.advertisement').random().show();
	$('#loader-modal').modal();
	$('#content').load('modules/' + module + '.html', function() {
		$('.nav-list').children('.active').removeClass('active');
		$(element).parent().addClass('active');
	});
}

function showConnectionOptions() {
	$("#connection-options").toggle();
}

function toggleSecurity(elem) {
	iElem = $(elem).children('i');
	if (iElem.hasClass('icon-lock')) {
		iElem.removeClass('icon-lock').addClass('icon-unlock');
		$(elem).removeClass('btn-success').addClass('btn-warning');
	}
	else {
		iElem.removeClass('icon-unlock').addClass('icon-lock');
		$(elem).removeClass('btn-warning').addClass('btn-success');
	}
}

function changeSleeState(method) {
	jolokia.execute("javax.slee.management:name=SleeManagement", method,
	{
		success: function(value) {
			//console.log(JSON.stringify(value));
			logToConsole('INFO', 'Server ' + method + ' completed successfuly.');
		}
	});
}

function logToConsole(level, text) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var s = time.getSeconds();
	var ms = time.getMilliseconds();
	var timeStr = (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m) + ':' + (s < 10 ? ('0' + s) : s) + ':' + (ms < 10 ? ('00' + ms) : (ms < 100 ? '0' + ms : ms));
	if (level == "INFO") {
		$('#console-log-text').prepend(timeStr + ' [' + level +'] ' + text + '<br/>');
	}
	else {
		$('#console-log-text').prepend("<span style='color: #CC0000;'>" + timeStr + " [" + level + "] " + text + "</span><br/>");
	}
}

function clearConsole() {
	$('#console-log-text').html('');
}

function toggleConsole() {
	if($(".console").height() > 50) {
		minimizeConsole();
	}
	else {
		maximizeConsole();
	}
}

function minimizeConsole() {
	// keep the sticky footer behavior...
	$('#wrap').animate({'margin-bottom': '-75px'});
	$('#push').animate({'height': '75px'});
	$('#footer').animate({'height': '75px'});

	$('.console').animate({'height': '20px'});

	$('#btn-min-max-console').children("i").toggleClass("icon-double-angle-up").toggleClass("icon-double-angle-down");
}

function maximizeConsole() {
	// keep the sticky footer behavior...
	$('#wrap').animate({'margin-bottom': '-215px'});
	$('#push').animate({'height': '215px'});
	$('#footer').animate({'height': '215px'});

	$('.console').animate({'height': '160px'});

	$('#btn-min-max-console').children("i").toggleClass("icon-double-angle-up").toggleClass("icon-double-angle-down");
	$("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

// --- Deployable Units Page Section ------------------------------------------

/* Doesn't work... no path :(
function onFileChange() {
	//get the file path
	var file = $('#realfile').val();
	//pull out the filename
	file = file.replace(/^.*\\/i, "");
	//show to user
	$('#du-filename').text(file);
	$("#install-du-btn").fadeOut(300, function(){
		$("#du-filename-box").fadeIn(300);
	});
}

function cancelDeployableUnitInstall() {
	$("#du-filename-box").fadeOut(300, function(){
		$("#install-du-btn").fadeIn(300);
	});
}

function confirmDeployableUnitInstall() {
	if ($("#du-persistent").attr("checked")) {
		mbean = "org.mobicents.slee:name=DeployerMBean";
		method = "persistentInstall";
	}
	else {
		mbean = "javax.slee.management:name=Deployment";
		method = "install";
	}
	jolokia.execute(mbean, method, $("#realfile").val(),
	{
		success: function(value) {
			//console.log(JSON.stringify(value));
			logToConsole('INFO', 'Server ' + method + ' completed successfuly.');
		}
	});
}
*/

function showDeployableUnitPathInput() {
	$("#show-install-btn").hide();
	$("#du-install-box").css("display", "block");
	$("#du-filename-path").focus();
}

function cancelDeployableUnitInstall() {
	$("#du-filename-path").val("");
	$("#du-install-box").css("display", "none");
	$("#show-install-btn").show();
}

function doDeployableUnitInstall(persistent) {
	if (persistent) {
		mbean = "org.mobicents.slee:name=DeployerMBean";
		method = "persistentInstall";
	}
	else {
		mbean = "javax.slee.management:name=Deployment";
		method = "install";
	}
	$.ajax({
		dataType: "json",
		url: "http://" + window.jolokiaAddress + ":" + window.jolokiaPort + "/jolokia/exec/" + jolokia.escape(mbean) + "/"  + method + "/" +  $("#du-filename-path").val().replace(/\//g,'!/')
	})
	.done(function(html) {
		if (html.error) {
			logToConsole("ERROR", html.error);
		}
		else {
			logToConsole("INFO", "Deployable Unit " + $("#du-filename-path").val() + " successfuly deployed.");
		}
	})
	.fail(function() {
		logToConsole("ERROR", "Failure trying to communicate with the JAIN SLEE Server. Please try again later.");
	})
	.always(function() {
		cancelDeployableUnitInstall();
	});
	// jolokia.execute(mbean, method, $("#du-filename-path").val(),
	// {
	//	success: function(value) {
	//		//console.log(JSON.stringify(value));
	//		logToConsole('INFO', 'Server ' + method + ' completed successfuly.');
	//	}
	// });
}

function uninstallDeployableUnit(url) {
	mbean = "javax.slee.management:name=Deployment";
	method = "uninstall";
	// jolokia.execute(mbean, method, url,
	// {
	//	success: function(value) {
	//		//console.log(JSON.stringify(value));
	//		logToConsole('INFO', 'Server ' + method + ' completed successfuly.');
	//	}
	// });
	$.ajax({
		dataType: "json",
		url: "http://" + window.jolokiaAddress + ":" + window.jolokiaPort + "/jolokia/exec/" + jolokia.escape(mbean) + "/"  + method + "/" +  url.replace(/\//g,'!/')
	})
	.done(function(html) {
		if (html.error) {
			logToConsole("ERROR", html.error);
		}
		else {
			logToConsole("INFO", "Deployable Unit " + $("#du-filename-path").val() + " successfuly deployed.");
		}
	})
	.fail(function() {
		logToConsole("ERROR", "Failure trying to communicate with the JAIN SLEE Server. Please try again later.");
	})
	.always(function() {
		cancelDeployableUnitInstall();
	});
}

function filterDeployableUnitsList() {
	filter = $("#dus-filter-input").val();
	if(filter) {
		$(".du-row").each(function() {
			rowText = $(this).text();
			if (rowText.indexOf(filter) !== -1) {
				$(this).fadeIn();
			}
			else {
				$(this).fadeOut();
			}
		});
	}
	else {
		$(".du-row").fadeIn();
	}
}

// TODO: Optimize and Refactor this
function filterComponents() {
	filterName = $("#comp-filter-input-name").val();
	filterVendor = $("#comp-filter-input-vendor").val();
	filterVersion = $("#comp-filter-input-version").val();

	// reset to total count
	$(".component-row-count").each(function() {
		txt = $(this).text();
		$(this).text(txt.substring(txt.indexOf('/')+1));
	});

	if(filterName || filterVendor || filterVersion) {
		$(".component-id-row").each(function() {
			nameText = $($(this).children().get(1)).text();
			vendorText = $($(this).children().get(2)).text();
			versionText = $($(this).children().get(3)).text();

			typeCountEl = $(this).parent().parent().parent().parent().prev().children(".component-row-count");
			typeCount = typeCountEl.text();

			if (typeCount.indexOf('/') == -1) {
				resTotal = typeCount;
				resCount = parseInt(resTotal, 0);
			}
			else {
				resTotal = typeCount.substring(typeCount.indexOf('/')+1);
				resCount = parseInt(typeCount.substring(0, typeCount.indexOf('/')), 0);
			}

			if (filterName) {
				if (nameText.indexOf(filterName) !== -1) {
					$(this).fadeIn();
				}
				else {
					//console.log("OUT BY NAM" + resCount + " > " + nameText + ";" + vendorText + ";" + versionText);
					typeCountEl.text(--resCount + "/" + resTotal);
					$(this).fadeOut();
					return true;
				}
			}

			if (filterVendor) {
				if (vendorText.indexOf(filterVendor) !== -1) {
					$(this).fadeIn();
				}
				else {
					//console.log("OUT BY VND" + resCount + " > " + nameText + ";" + vendorText + ";" + versionText);
					typeCountEl.text(--resCount + "/" + resTotal);
					$(this).fadeOut();
					return true;
				}
			}

			if (filterVersion) {
				if (versionText.indexOf(filterVersion) !== -1) {
					$(this).fadeIn();
				}
				else {
					//console.log("OUT BY VRS" + resCount + " > " + nameText + ";" + vendorText + ";" + versionText);
					typeCountEl.text(--resCount + "/" + resTotal);
					$(this).fadeOut();
					return true;
				}
			}
			typeCountEl.text(resCount + "/" + resTotal);
			//console.log("" + resCount + " > " + nameText + ";" + vendorText + ";" + versionText);
		});
	}
	else {
		$(".component-id-row").fadeIn();
	}
}

function filterComponentsClear() {
	$(".filter-component").val("");
	filterComponents();
}

// --- Services Page Section ----------------------------------------------------

function selectService(elem) {
	// TODO: Remove background when unchecked
	if(elem[0].checked) {
		elem.parent().parent().css('background-color', '#FFFFDD');
	}
	else {
		elem.parent().parent().css('background-color', '');
	}
	selectedServices = $(".service-checkbox:checked");
	if (selectedServices.length !== 0) {
		$(".multi-service-operations").show();
	}
	else {
		$(".multi-service-operations").hide();
	}
}

function selectAllServices(elem) {
	// check if there are possible actions.. we disable those which aren't ;)
	$(".service-checkbox").prop("checked", elem.checked);
	$(".service-checkbox").parent().parent().css('background-color', elem.checked ? '#FFFFDD' : '');
}

function serviceOperation(op, id) {
	jolokia.execute("javax.slee.management:name=ServiceManagement", op+"(javax.slee.ServiceID)", id,
	{
		success: function(value) {
			//console.log(JSON.stringify(value));
			logToConsole('INFO', 'Service ' + id + ' ' + op + ' action completed successfuly.');
			setTimeout(updateServices, 1000);
		}
	});
}

function checkShowServices() {
	$('#services-table').show();
	if($('.active-service').is(":visible") || $('.inactive-service').is(":visible") || $('.stopping-service').is(":visible")) {
		$('#no-services-table').hide();
		$('#services-table').fadeIn();
	}
	else {
		$('#services-table').hide();
		$('#no-services-table').fadeIn();
	}
}

// --- Resources Page Section -------------------------------------------------

function createRAEntity(raId, entityName) {
	jolokia.execute("javax.slee.management:name=ResourceManagement", "createResourceAdaptorEntity", raId, entityName, "",
	{
		success: function(value) {
			logToConsole('INFO', 'Created Resource Adaptor Entity "' + entityName + '" for ' + raId + ' successfuly.');
		},
		error: function(value) {
			errorUID = ("st" + new Date().getTime()).hashCode();
			logToConsole("ERROR", "Failed to create Resource Adaptor Entity with \"" + value.error + "\". (<a href=\"#" + errorUID + "-modal\" data-toggle=\"modal\">Full Stack Trace</a>)");
			createStackTrace(errorUID, value.stacktrace);
		}
	});
	loadEntities(null, raId);
}

/**
 * Activate/Deactivate the Resource Adaptor Entity state
 *
 * @param entityName the ra entity name to perform action on
 * @param op the operation to perform, can be "activate" or "deactivate"
 */
function setEntityState(entityName, op) {
	jolokia.execute("javax.slee.management:name=ResourceManagement", op + "ResourceAdaptorEntity", entityName,
	{
		success: function(value) {
			logToConsole('INFO', 'Resource Adaptor Entity "' + entityName + '" ' + op + 'd successfuly.');
		}
	});
}

function validateEntityName() {
	eName = $("#add-entity-entity-name").val();
	if (eName.length > 0) {
		$('#add-entity-button').removeAttr('disabled');
	}
	else {
		$('#add-entity-button').attr('disabled', 'disabled');
	}
}

function validateLinkName(entityName) {
	linkName = $("#bind-link-name").val();
	if (linkName.length > 0) {
		$('#' + entityName + '-bind-link-button').removeAttr('disabled');
	}
	else {
		$('#' + entityName + '-bind-link-button').attr('disabled', 'disabled');
	}
}

function bindLinkName(entityName, linkName) {
	jolokia.execute("javax.slee.management:name=ResourceManagement", "bindLinkName", entityName, linkName,
	{
		success: function(value) {
			logToConsole("INFO", "Bound Link \"" + linkName + "\" for Resource Adaptor Entity \"" + entityName + "\" successfuly.");
		},
		error: function(value) {
			errorUID = ("st" + new Date().getTime()).hashCode();
			createStackTrace(errorUID, value.stacktrace);
			logToConsole("ERROR", "Failed to bind link with " + value.error + ". (<a href=\"#" + errorUID + "-modal\" data-toggle=\"modal\">Full Stack Trace</a>)");
		}
	});
}

function unbindLinkName(entityName, linkName) {
	jolokia.execute("javax.slee.management:name=ResourceManagement", "unbindLinkName", linkName,
	{
		success: function(value) {
			logToConsole("INFO", "Unbound Link \"" + linkName + "\" for Resource Adaptor Entity \"" + entityName + "\" successfuly.");
		},
		error: function(value) {
			errorUID = ("st" + new Date().getTime()).hashCode();
			createStackTrace(errorUID, value.stacktrace);
			logToConsole("ERROR", "Failed to unbind link with " + value.error + ". (<a href=\"#" + errorUID + "-modal\" data-toggle=\"modal\">Full Stack Trace</a>)");
		}
	});
}

function createStackTrace(id, stacktrace) {
	newModal = $("#st-template-modal").clone();
	newModal.attr("id", id + "-modal");
	newModal.find(".modal-body").children("pre").html(stacktrace);
	$("body").append(newModal);
}

// --- Alarms Page Section ----------------------------------------------------

function clearAlarm(id) {
	jolokia.execute("javax.slee.management:name=Alarm", "clearAlarm", id,
	{
		success: function(value) {
			logToConsole('INFO', 'Alarm with ID "' + id + '" cleared successfuly.');
			setTimeout(updateAlarms, 50);
		}
	});
}

function toggleShowAlarms(el, level) {
	if ($(el).is(':checked')) {
		$('tr.alarm-' + level).fadeIn();
	}
	else {
		$('tr.alarm-' + level).hide();
	}
	checkShowAlarms();
}

function checkShowAlarms() {
	$('#alarms-table').show();
	if($("tr[class^='alarm-']").is(":visible")) {
		$('#no-alarms-table').hide();
		$('#alarms-table').fadeIn();
	}
	else {
		$('#alarms-table').hide();
		$('#no-alarms-table').fadeIn();
	}
}

String.prototype.hashCode = function(){
    var hash = 0, i, ch;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        ch = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

String.prototype.addCommas = function() {
    var x = this.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

String.prototype.toHHMMSS = function () {
    sec_numb    = parseInt(this, 10); // don't forget the second parm
    var days   = Math.floor(sec_numb / (24*3600));
    var hours   = Math.floor((sec_numb - (days * 3600 * 24)) / 3600);
    var minutes = Math.floor((sec_numb - (days * 3600 * 24) - (hours * 3600)) / 60);
    var seconds = sec_numb - (days * 3600 * 24) - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = days+'<small>days &nbsp; </small><hr>'+hours+'<small>hours &nbsp;</small><br>'+minutes+'<small>minutes</small><br>'+seconds+'<small>seconds</small><br>';
    return time;
};

// ----

function BatchRequestsFactory() {
	var monitoredMbeans = [];

	this.create = function(mbeans) {
		mbeans = $.makeArray(mbeans);
		monitoredMbeans = monitoredMbeans.concat(mbeans);
	};

	function prepareBatchRequest() {
		return $.map(monitoredMbeans, function(mbean) {
			switch(mbean.type) {
				case 'read':
					return {
						type: mbean.type,
						opts: mbean.args,
						mbean: mbean.name,
						attribute: mbean.attribute,
						path: mbean.path
					};
				case 'exec':
					return {
						type: mbean.type,
						arguments: mbean.args,
						mbean: mbean.name,
						operation: mbean.operation,
						path: mbean.path
					};
			}
		});
	}

	this.doRequest = function() {
		var requests = prepareBatchRequest();
		var responses = jolokia.request(requests);
		return responses;
	};

}