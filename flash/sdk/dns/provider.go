package dns

type Provider interface {
	Insert(subdomain string) error
}
