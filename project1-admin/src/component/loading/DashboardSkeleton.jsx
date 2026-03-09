import React from 'react';
import { Box, Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ShimmerEffect = {
    initial: { opacity: 0.6 },
    animate: {
        opacity: [0.6, 1, 0.6],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const BetCardSkeleton = () => (
    <motion.div variants={ShimmerEffect} initial="initial" animate="animate">
        <Box
            p={5}
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            mb={4}
            boxShadow="sm"
        >
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={6} align="center">
                {/* User Part */}
                <Stack direction="row" spacing={4} align="center" minW="240px">
                    <SkeletonCircle size="14" borderRadius="2xl" />
                    <Stack spacing={2} flex="1">
                        <Skeleton h="4" w="32" borderRadius="md" />
                        <Skeleton h="3" w="24" borderRadius="sm" />
                    </Stack>
                </Stack>

                {/* Game Part */}
                <Box flex="1" p={4} bg="gray.50" borderRadius="2xl" w="full">
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={5} align="center">
                        <Stack spacing={2} align={{ base: 'center', md: 'start' }} minW="100px">
                            <Skeleton h="2" w="10" />
                            <Skeleton h="4" w="16" borderRadius="lg" />
                        </Stack>
                        <Skeleton h="8" w="1px" display={{ base: 'none', md: 'block' }} />
                        <Stack spacing={2} flex="1" align={{ base: 'center', md: 'start' }}>
                            <Skeleton h="2" w="20" />
                            <Skeleton h="4" w="full" maxW="200px" />
                        </Stack>
                    </Stack>
                </Box>

                {/* Result Part */}
                <Stack direction="row" spacing={8} align="center" minW="280px" justify="end">
                    <Stack align="end" spacing={2}>
                        <Skeleton h="2" w="16" />
                        <Skeleton h="6" w="24" />
                    </Stack>
                    <Stack align="end" spacing={2}>
                        <Skeleton h="8" w="24" borderRadius="2xl" />
                        <Skeleton h="2" w="16" />
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    </motion.div>
);

export const UserCardSkeleton = () => (
    <motion.div variants={ShimmerEffect} initial="initial" animate="animate">
        <Box
            p={3}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            mb={3}
            w="full"
        >
            <Stack direction="row" spacing={4} align="center" justify="space-between">
                <Stack direction="row" spacing={3} align="center" flex="1">
                    <SkeletonCircle size="12" />
                    <Stack spacing={2}>
                        <Skeleton h="3" w="24" />
                        <Skeleton h="2" w="16" />
                    </Stack>
                </Stack>
                <Stack align="center" flex="1">
                    <Skeleton h="2" w="12" />
                    <Skeleton h="4" w="16" />
                </Stack>
                <Stack align="center" flex="1" display={{ base: 'none', md: 'flex' }}>
                    <Skeleton h="2" w="12" />
                    <Skeleton h="3" w="20" />
                </Stack>
                <SkeletonCircle size="10" />
            </Stack>
        </Box>
    </motion.div>
);

const DashboardSkeleton = ({ type = 'bet', count = 3 }) => {
    return (
        <Box w="full">
            {Array(count).fill(0).map((_, i) => (
                type === 'bet' ? <BetCardSkeleton key={i} /> : <UserCardSkeleton key={i} />
            ))}
        </Box>
    );
};

export default DashboardSkeleton;
