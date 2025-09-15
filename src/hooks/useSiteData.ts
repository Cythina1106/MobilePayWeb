import { useState, useEffect, useCallback } from 'react';
import {siteApi} from '../services/siteApi';

// 类型定义
interface City {
  cityCode: string;
  cityName: string;
}

interface SiteQuery {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  city?: string;
  status?: string;
  site_type?: string;
}

interface SiteListResponse {
  records: Site[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

interface Site {
  site_id: string;
  site_name: string;
  site_code: string;
  site_address: string;
  city: string;
  line_name: string;
  type_name?: string;
  site_type_name?: string;
  status?: string;
  status_name?: string;
}

interface UseSiteDataResult {
  // 状态
  cities: City[];
  sites: Site[];
  siteListResponse: SiteListResponse | null;
  selectedCity: string;
  siteQuery: SiteQuery;
  loading: boolean;
  sitesLoading: boolean;
  error: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setSiteQuery: (query: SiteQuery) => void;
  setSelectedCity: (city: string) => void;

  // 方法
  fetchCities: () => Promise<void>;
  fetchSites: (query?: SiteQuery) => Promise<void>;
  searchSites: () => Promise<void>;
  handleCitySelect: (cityCode: string) => void;
  handleQueryChange: (key: keyof SiteQuery, value: any) => void;
  handlePageChange: (pageNum: number) => void;
}

export const useSiteData = (): UseSiteDataResult => {
  // 状态定义
  const [cities, setCities] = useState<City[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteListResponse, setSiteListResponse] = useState<SiteListResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [siteQuery, setSiteQuery] = useState<SiteQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    city: '',
    status: '',
    site_type: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sitesLoading, setSitesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 获取城市列表
  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('调用站点城市列表API...');
      const response = await siteApi.getCities();
      console.log('城市列表API响应:', response);

      if (response.success && response.data) {
        setCities(response.data);
        // 默认选择第一个城市
        if (response.data.length > 0 && !selectedCity) {
          setSelectedCity(response.data[0].cityCode);
          setSiteQuery(prev => ({ ...prev, city: response.data[0].cityName }));
        }
        console.log(`成功获取 ${response.data.length} 个城市`);
      } else {
        setError(`获取城市列表失败: ${response.message}`);
      }
    } catch (err) {
      console.error('获取城市列表失败:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`网络错误: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  // 获取站点列表
  const fetchSites = useCallback(async (query: SiteQuery = siteQuery) => {
    setSitesLoading(true);
    try {
      console.log('调用站点列表API...', query);
      const response = await siteApi.getSites(query);
      console.log('站点列表API响应:', response);

      if (response.success && response.data) {
        // 适配后端返回的数据格式
        const adaptedData: SiteListResponse = {
          records: response.data.records || [],
          total: response.data.total || 0,
          size: response.data.size || query.pageSize || 10,
          current: response.data.current || query.pageNum || 1,
          pages: response.data.pages || 1
        };

        setSiteListResponse(adaptedData);
        setSites(response.data.records || []);
        console.log(`成功获取 ${response.data.records?.length || 0} 个站点`);
      } else {
        setError(`获取站点列表失败: ${response.message}`);
      }
    } catch (err) {
      console.error('获取站点列表失败:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`获取站点列表失败: ${errorMessage}`);
    } finally {
      setSitesLoading(false);
    }
  }, [siteQuery]);

  // 搜索站点 - 重置到第一页并刷新数据
  const searchSites = useCallback(async () => {
    // 搜索时重置到第一页
    const updatedQuery = {
      ...siteQuery,
      pageNum: 1
    };
    setSiteQuery(updatedQuery);
    await fetchSites(updatedQuery);
  }, [siteQuery, fetchSites]);

  // 处理城市选择
  const handleCitySelect = useCallback((cityCode: string) => {
    setSelectedCity(cityCode);
    const selectedCityInfo = cities.find(city => city.cityCode === cityCode);
    if (selectedCityInfo) {
      setSiteQuery(prev => ({ ...prev, city: selectedCityInfo.cityName, pageNum: 1 }));
    }
    console.log('选择城市:', cityCode);
  }, [cities]);

  // 处理查询参数变化
  const handleQueryChange = useCallback((key: keyof SiteQuery, value: any) => {
    setSiteQuery(prev => ({ ...prev, [key]: value, pageNum: 1 }));
  }, []);

  // 处理分页
  const handlePageChange = useCallback((pageNum: number) => {
    setSiteQuery(prev => ({ ...prev, pageNum }));
  }, []);

  // 组件加载时获取城市列表
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // 当选中城市或查询参数变化时获取站点列表
  useEffect(() => {
    if (selectedCity) {
      fetchSites();
    }
  }, [selectedCity, siteQuery, fetchSites]);

  return {
    cities,
    sites,
    siteListResponse,
    selectedCity,
    siteQuery,
    loading,
    sitesLoading,
    error,
    fetchCities,
    fetchSites,
    searchSites,
    handleCitySelect,
    handleQueryChange,
    handlePageChange,
    setError,
    setLoading,
    setSiteQuery,
    setSelectedCity
  };
};

export default useSiteData;
