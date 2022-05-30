// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//时间工具
contract DateUtil {
    uint256 internal constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint256 internal constant SECONDS_PER_HOUR = 60 * 60;
    uint256 internal constant SECONDS_PER_MINUTE = 60;
    uint256 internal constant OFFSET19700101 = 2440588;

    //每月天数
    uint8[] monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //时间戳转日期
    function daysToDate(uint256 timestamp, uint8 timezone)
        internal
        pure
        returns (
            uint256 year,
            uint256 month,
            uint256 day
        )
    {
        return _daysToDate(timestamp + timezone * uint256(SECONDS_PER_HOUR));
    }

    //时间戳转日期，UTC时区
    function _daysToDate(uint256 timestamp)
        private
        pure
        returns (
            uint256 year,
            uint256 month,
            uint256 day
        )
    {
        uint256 _days = uint256(timestamp) / SECONDS_PER_DAY;

        uint256 L = _days + 68569 + OFFSET19700101;
        uint256 N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * year) / 4 + 31;
        month = (80 * L) / 2447;
        day = L - (2447 * month) / 80;
        L = month / 11;
        month = month + 2 - 12 * L;
        year = 100 * (N - 49) + year + L;
    }
}
