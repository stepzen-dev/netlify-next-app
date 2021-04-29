import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import "../styles/globals.css";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	headers: {
		Authorization: `Apikey ${process.env.STEPZEN_ADMIN_KEY}`,
	},
	uri: `https://${process.env.STEPZEN_ACCOUNT}.stepzen.net/${process.env.STEPZEN_FOLDER}/${process.env.STEPZEN_NAME}/__graphql`,
});

function MyApp({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}

export default MyApp;
