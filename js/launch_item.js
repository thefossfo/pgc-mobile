var launchHeaderHTML = "";
function launchItem(launch) {
	let html = "";
	html +=	'<div class="block-item block-item-table launch-item" data-id="' + launch.id +'">';
	html += '<div class="block-item-tr">';
	html +=   '<div class="block-item-td launch-image" style="background-image: url(\'' + launch.image + '\')">';
	html += '</div>';
	html += '<div class="block-item-td">';
	launchHeaderHTML = "";
	if (launch.on_location_name_short != null) {
		launchHeaderHTML += '<div class="launch-header-item">';
		launchHeaderHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M5.75 6.5c0 1.195.035 2.834.025 4.172m-.212-7.266c-.01-.187-.034-.44-.062-.717c-.094-.92-.773-1.774-1.69-1.9a4 4 0 0 0-.53-.04a4 4 0 0 0-.53.04c-.916.126-1.569.981-1.621 1.905C.985 5.248.767 8.172.786 10.672"></path><path d="M.781 10.719a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0m7.5-4.219c0 1.202-.035 2.852-.024 4.195m.212-7.289c.01-.187.033-.44.061-.717c.094-.92.773-1.774 1.69-1.9a4 4 0 0 1 .53-.039q.267.001.53.039c.916.126 1.569.981 1.621 1.905c.145 2.561.364 5.496.344 8"></path><path d="M13.25 10.719a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0M9.512 4.23c-1.706-1.14-3.318-1.14-5.024 0"></path></g></svg> ';
		launchHeaderHTML += launch.on_location_name_short + '</div>';
	}
	if (launch.is_crewed) {
		launchHeaderHTML += '<div class="launch-header-item">';
		launchHeaderHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><circle cx="12" cy="11" r="3"/><path d="M17.657 18A9 9 0 1 0 3 11v9m15.5-2.5l-4.379-4.379M18 5l-3.88 3.879"/><path d="M18 18H5c-.943 0-1.414 0-1.707.293S3 19.057 3 20s0 1.414.293 1.707S4.057 22 5 22h15a1 1 0 0 0 1-1a3 3 0 0 0-3-3"/></g></svg> ';
		launchHeaderHTML += 'Crewed</div>';
	}
	switch(launch.launch_service_provider) {
		case null:
			break;
		case 'Arianespace':
			launchHeaderRenderLSP(launch.launch_service_provider);
		break
		case 'Blue Origin':
			launchHeaderRenderLSP(launch.launch_service_provider);
			break
		case 'China Aerospace Science and Technology Corporation':
			launchHeaderRenderLSP('China Aerospace');
			break
		case 'China Rocket Co. Ltd.':
			launchHeaderRenderLSP('ChinaRocket');
			break
		case 'Firefly Aerospace':
			launchHeaderRenderLSP('Firefly');
			break
		case 'Gilmour Space Technologies':
			launchHeaderRenderLSP('Gilmour Space');
			break
		case 'Indian Space Research Organization':
			launchHeaderRenderLSP('ISRO');
			break
		case 'i-Space':
			launchHeaderRenderLSP('i-Space');
			break
		case 'Japan Aerospace Exploration Agency':
			launchHeaderRenderLSP('JAXA');
			break
		case 'Khrunichev State Research and Production Space Center':
			launchHeaderRenderLSP('Khrunichev');
			break
		case 'Kii-based Advanced & Instant ROcket System':
			launchHeaderRenderLSP('KAIROS');
			break
		case 'Korea Aerospace Research Institute':
			launchHeaderRenderLSP('KARI');
			break
		case 'Mitsubishi Heavy Industries':
			launchHeaderRenderLSP('Mitsubishi');
			break
		case 'National Aeronautics and Space Administration':
			launchHeaderRenderLSP('NASA');
			break
		case 'Northrop Grumman Space Systems':
			launchHeaderRenderLSP('Northrop Grumman');
			break
		case 'Orbex':
			launchHeaderRenderLSP(launch.launch_service_provider);
			break
		case 'Rocket Factory Augsburg':
			launchHeaderRenderLSP('RFA');
			break
		case 'Rocket Lab':
			launchHeaderRenderLSP(launch.launch_service_provider);
			break
		case 'Russian Federal Space Agency (ROSCOSMOS)':
			launchHeaderRenderLSP('ROSCOSMOS');
			break
		case 'Russian Space Forces':
			launchHeaderRenderLSP('RSF');
			break
		case 'Skyrora':
			launchHeaderRenderLSP(launch.launch_service_provider);
			break
		case 'SpaceX':
			launchHeaderRenderLSP(launch.launch_service_provider);
			break
		case 'United Launch Alliance':
			launchHeaderRenderLSP('ULA');
			break
	}
	html +=   '<div class="launch-header-container">' + launchHeaderHTML + '</div>';
	if (launch.mission_name) {
		html +=   '<h3>' + launch.mission_name + "</h3>";
	} else {
		html +=   '<h3>' + launch.name + "</h3>";
	}
	html +=   '<p><strong>';
	html +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"/></g></svg>';
	html += '</strong> ' + formatLaunchDate(launch.date,launch.net_precision) + '</p>';
	html += '<p><strong>';
	html +=
	'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"><path d="M13 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"/><path d="M17.5 9.5c0 3.038-2 6.5-5.5 10.5c-3.5-4-5.5-7.462-5.5-10.5a5.5 5.5 0 1 1 11 0Z"/></g></svg>';
	html += '</strong> ' + launch.location + '</p>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	return(html);
}
function launchHeaderRenderLSP(LSP) {
	launchHeaderHTML += '<div class="launch-header-item">';
	launchHeaderHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"/></svg> ';
	launchHeaderHTML += LSP + '</div>';
}

