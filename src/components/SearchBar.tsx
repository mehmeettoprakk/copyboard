import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export const SearchBar = ({ value, onChangeText }: Props) => {
  return (
    <View className="mb-4 rounded-3xl border border-cyan-100/80 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80">
      <View className="flex-row items-center gap-3">
        <Text className="text-sm font-bold uppercase tracking-widest text-cyan-700/90 dark:text-cyan-400">
          Ara
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Isim veya icerik ara"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-base font-medium text-slate-900 dark:text-slate-100"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={10}
            className="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-700"
          >
            <Text className="text-xs font-bold text-slate-600 dark:text-slate-200">Temizle</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
