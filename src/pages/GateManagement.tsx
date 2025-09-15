import React, { useState } from 'react'
import '../styles/GateManagement.css'
import { useStations } from '../hooks/useStations'
import { useGates } from '../hooks/useGates'
import { useGateUsers } from '../hooks/useGateUsers'
import { useTripRecords } from '../hooks/useTripRecords'
import StationManagement from '../components/GateManagement/StationManagement'
import GateManagementComp from '../components/GateManagement/GateManagementComp'
import UserManagement from '../components/GateManagement/UserManagement'
import TripRecords from '../components/GateManagement/TripRecords'

const GateManagement = () => {
  const [activeTab, setActiveTab] = useState<'stations' | 'gates' | 'users' | 'records'>('stations')
  const [searchTerm, setSearchTerm] = useState('')

  // 使用自定义hooks管理数据
  const { stations, filteredStations, currentPage, totalPages, pageSize, availableCities, availableLines, cityFilter, lineFilter, statusFilter, setSearchTerm: setStationSearchTerm, setCityFilter, setLineFilter, setStatusFilter, setCurrentPage, setPageSize, resetFilters, saveStation, deleteStation, getStationById } = useStations(searchTerm)
  const { gates, filteredGates, setSearchTerm: setGateSearchTerm, saveGate, deleteGate, getGateById } = useGates(searchTerm, stations)
  const { gateUsers, filteredUsers, setSearchTerm: setUserSearchTerm, saveUser, changeUserStatus, getUserById } = useGateUsers(searchTerm)
  const { tripRecords, filteredRecords, setSearchTerm: setRecordSearchTerm, exportRecords } = useTripRecords(searchTerm)

  // 处理标签页切换
  const handleTabChange = (tab: 'stations' | 'gates' | 'users' | 'records') => {
    setActiveTab(tab)
    setSearchTerm('')
    // 清除对应模块的搜索词
    switch (tab) {
      case 'stations':
        setStationSearchTerm('')
        break
      case 'gates':
        setGateSearchTerm('')
        break
      case 'users':
        setUserSearchTerm('')
        break
      case 'records':
        setRecordSearchTerm('')
        break
    }
  }

  // 处理全局搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    // 根据当前标签页设置对应模块的搜索词
    switch (activeTab) {
      case 'stations':
        setStationSearchTerm(term)
        break
      case 'gates':
        setGateSearchTerm(term)
        break
      case 'users':
        setUserSearchTerm(term)
        break
      case 'records':
        setRecordSearchTerm(term)
        break
    }
  }

  return (
    <div className="gate-management">
      <div className="management-header">
        <h2>闸机设备管理</h2>
        <p>管理地铁站点、闸机设备和用户出行服务</p>
      </div>

      <div className="management-tabs">
        <button
          className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
          onClick={() => handleTabChange('stations')}
        >
          站点管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`}
          onClick={() => handleTabChange('gates')}
        >
          闸机设备
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          用户管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => handleTabChange('records')}
        >
          出行记录
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stations' && (
          <StationManagement
            stations={stations}
            filteredStations={filteredStations}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            availableCities={availableCities}
            availableLines={availableLines}
            cityFilter={cityFilter}
            lineFilter={lineFilter}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onCityFilterChange={setCityFilter}
            onLineFilterChange={setLineFilter}
            onStatusFilterChange={setStatusFilter}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onResetFilters={resetFilters}
            onSaveStation={saveStation}
            onDeleteStation={deleteStation}
            onGetStationById={getStationById}
          />
        )}
        {activeTab === 'gates' && (
          <GateManagementComp
            gates={gates}
            filteredGates={filteredGates}
            stations={stations}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onSaveGate={saveGate}
            onDeleteGate={deleteGate}
            onGetGateById={getGateById}
          />
        )}
        {activeTab === 'users' && (
          <UserManagement
            gateUsers={gateUsers}
            filteredUsers={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onSaveUser={saveUser}
            onChangeUserStatus={changeUserStatus}
            onGetUserById={getUserById}
          />
        )}
        {activeTab === 'records' && (
          <TripRecords
            tripRecords={tripRecords}
            filteredRecords={filteredRecords}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onExportRecords={exportRecords}
          />
        )}
      </div>
    </div>
  )
}

export default GateManagement
