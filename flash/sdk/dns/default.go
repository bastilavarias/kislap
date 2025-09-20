package dns

import (
	"runtime"
)

var defaultProvider Provider

func Default(environment, rootDomain string) Provider {
	if environment == "local" {
		defaultProvider = SetHostAsDNS(runtime.GOOS, rootDomain)
	} else {
		//defaultProvider = SetCloudflareAsDNS(token)
	}

	return defaultProvider
}

func Insert(subdomain string) error {
	return defaultProvider.Insert(subdomain)
}
