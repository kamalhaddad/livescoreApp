import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { GameStatus, SortOption } from './FilterBar';

interface FilterBarProps {
  selectedStatus: GameStatus;
  selectedSort: SortOption;
  onStatusChange: (status: GameStatus) => void;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search teams..."
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor="#6B7280"
      />

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusContainer}
        contentContainerStyle={styles.statusContent}
      >
        {(['all', 'live', 'finished', 'scheduled'] as GameStatus[]).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => onStatusChange(status)}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.statusButtonActive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status && styles.statusTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortOptions}>
          {([
            { value: 'time', label: 'Time' },
            { value: 'league', label: 'League' },
            { value: 'team', label: 'Team' },
          ] as { value: SortOption; label: string }[]).map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSortChange(option.value)}
              style={[
                styles.sortButton,
                selectedSort === option.value && styles.sortButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  selectedSort === option.value && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusContent: {
    paddingRight: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  statusButtonActive: {
    backgroundColor: '#3B82F6',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#E5E7EB',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortButtonTextActive: {
    color: '#1F2937',
  },
}); 