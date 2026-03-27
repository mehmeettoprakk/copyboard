import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { ClipboardItemCard } from '../src/components/ClipboardItemCard';
import { SearchBar } from '../src/components/SearchBar';
import { useClipboard } from '../src/context/ClipboardContext';

export default function HomeScreen() {
  const router = useRouter();
  const {
    items,
    query,
    loading,
    error,
    lastCopiedId,
    copyItemToClipboard,
    removeItem,
    refreshItems,
    saveClipboardText,
    setQuery,
  } = useClipboard();

  const emptyState = useMemo(() => {
    if (query.trim().length > 0) {
      return 'Arama kriterine uygun kayit bulunamadi.';
    }

    return 'Henuz kayit yok. Panonuzdaki metni kaydederek baslayin.';
  }, [query]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const handleQuickSave = async () => {
    const text = (await Clipboard.getStringAsync()).trim();
    if (!text) {
      Alert.alert('Panoda kaydedilecek metin bulunamadi.');
      return;
    }

    await saveClipboardText(text);
    Alert.alert('Pano metni kaydedildi.');
  };

  const handleOpenMenu = () => {
    Alert.alert('Menu', 'Bu alan yakinda filtre/siralama icin kullanilacak.');
  };

  const handleArchiveTab = () => {
    Alert.alert('Arsiv', 'Arsiv sekmesi yakinda aktif olacak.');
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>
      <View className="flex-1 px-4">
        <View className="mb-5 mt-2 flex-row items-start">
          <View className="w-1/3 items-start">
            <Pressable
              onPress={() => void handleQuickSave()}
              hitSlop={10}
              className="h-11 justify-center rounded-full border border-white/15 bg-white/10 px-4"
            >
              <Text className="text-base font-bold text-white">+ Kaydet</Text>
            </Pressable>
          </View>

          <View className="w-1/3 items-center pt-0.5">
            <Text className="text-[30px] font-extrabold leading-8 text-white">Pano</Text>
            <Text className="text-xs font-semibold uppercase tracking-widest text-white/50">
              {items.length} kayit
            </Text>
          </View>

          <View className="w-1/3 items-end">
            <Pressable
              onPress={handleOpenMenu}
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10"
            >
              <Text className="text-2xl leading-6 text-white">•••</Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <SearchBar value={query} onChangeText={setQuery} />
        </View>

        {error ? (
          <Text className="mb-3 rounded-2xl bg-red-900/40 px-3 py-2 text-sm font-semibold text-red-200">
            {error}
          </Text>
        ) : null}

        <FlatList
          data={items}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <View className="flex-1">
              <ClipboardItemCard
                index={index}
                item={item}
                copied={lastCopiedId === item.id}
                onCopy={() => void copyItemToClipboard(item)}
                onDelete={() => void removeItem(item.id)}
                onEdit={() =>
                  router.push({
                    pathname: '/edit/[id]',
                    params: { id: String(item.id) },
                  })
                }
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="mt-20 items-center rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-10">
              <Text className="mb-2 text-xl font-extrabold text-white">Bos pano</Text>
              <Text className="text-center text-base leading-6 text-white/70">{emptyState}</Text>
            </View>
          )}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-950/95 px-6 pb-7 pt-3">
        <View className="flex-row items-center justify-between">
          <Pressable className="items-center" onPress={() => void refreshItems()}>
            <Text className="text-2xl text-white">◫</Text>
            <Text className="mt-1 text-sm font-semibold text-white">Clipboard</Text>
          </Pressable>
          <Pressable className="items-center" onPress={handleArchiveTab}>
            <Text className="text-2xl text-white/40">⧉</Text>
            <Text className="mt-1 text-sm font-semibold text-white/40">Arsiv</Text>
          </Pressable>
          <Pressable className="items-center" onPress={() => Alert.alert('Ayarlar yakinda eklenecek')}>
            <Text className="text-2xl text-white/40">⚙</Text>
            <Text className="mt-1 text-sm font-semibold text-white/40">Settings</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
