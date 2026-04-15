nums1 = [1,2,3,0,0,0]
nums2 = [2,5,6]

m = 3
n = 3

i = 0
while(len(nums2) == m + n):
    nums2.append(0)
    i +=1

print(nums2)

sorted_arr = []
i = 0
while len(sorted_arr) !=(m+n) -1:
    if nums1[i] >= nums2[i]:
        sorted_arr.append(nums2[i])
    elif(nums1[i] < nums2[i]):
        sorted_arr.append(nums1[i])
    else:
        sorted_arr.append(nums2[i])
        sorted_arr.append(nums1[i])
    i+=1


