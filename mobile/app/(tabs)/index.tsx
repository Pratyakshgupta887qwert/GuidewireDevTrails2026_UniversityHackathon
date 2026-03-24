import Constants from 'expo-constants';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

function resolveWebAppUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  const configuredPort = process.env.EXPO_PUBLIC_WEB_PORT?.trim() || '5173';

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:${configuredPort}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${configuredPort}`;
  }

  return `http://localhost:${configuredPort}`;
}

export default function HomeScreen() {
  const webAppUrl = useMemo(() => resolveWebAppUrl(), []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>AegisAI Mobile</Text>
          <Text style={styles.url}>{webAppUrl}</Text>
        </View>
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Expo Web Limitation</Text>
          <Text style={styles.errorText}>React Native WebView does not run inside Expo web preview.</Text>
          <Text style={styles.errorHint}>Use Expo Go on phone for native wrapper, or open the web app directly on laptop.</Text>
          <Pressable style={styles.button} onPress={() => Linking.openURL(webAppUrl)}>
            <Text style={styles.buttonText}>Open Web App in Browser</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>AegisAI Mobile</Text>
        <Text style={styles.url}>{webAppUrl}</Text>
      </View>

      {loadError ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Could not open web app</Text>
          <Text style={styles.errorText}>{loadError}</Text>
          <Text style={styles.errorHint}>
            Make sure frontend is running on port 5173 (or your configured port) and your phone is on the same network.
          </Text>
          <Pressable style={styles.button} onPress={() => { setLoadError(null); setReloadCount((v) => v + 1); }}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={`${webAppUrl}-${reloadCount}`}
          source={{ uri: webAppUrl }}
          originWhitelist={['*']}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          renderLoading={() => (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#3147a6" />
              <Text style={styles.loaderText}>Loading AegisAI...</Text>
            </View>
          )}
          onError={(event) => {
            setLoadError(event.nativeEvent.description || 'Network error while loading web app.');
          }}
          onHttpError={(event) => {
            setLoadError(`HTTP ${event.nativeEvent.statusCode} while loading web app.`);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f4fb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d9e0f2',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  title: {
    color: '#162765',
    fontSize: 18,
    fontWeight: '700',
  },
  url: {
    color: '#5f6a8a',
    fontSize: 12,
    marginTop: 2,
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loaderText: {
    color: '#3a4770',
    fontSize: 14,
    fontWeight: '500',
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 8,
  },
  errorTitle: {
    color: '#14204e',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#53608b',
    fontSize: 14,
    textAlign: 'center',
  },
  errorHint: {
    color: '#6476ad',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#3147a6',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
