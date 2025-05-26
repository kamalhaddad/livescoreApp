import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>LiveScore Hub</Text>
        <Text style={styles.subtitle}>Real-time scores and stats</Text>
      </View>

      <ScrollView horizontal style={styles.nav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>NFL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>NBA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Soccer</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content}>
        {/* NFL Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NFL Games</Text>
          <Text style={styles.placeholder}>Live games will appear here</Text>
        </View>

        {/* NBA Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NBA Games</Text>
          <Text style={styles.placeholder}>Live games will appear here</Text>
        </View>

        {/* Soccer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soccer Matches</Text>
          <Text style={styles.placeholder}>Live matches will appear here</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  nav: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
  },
});
