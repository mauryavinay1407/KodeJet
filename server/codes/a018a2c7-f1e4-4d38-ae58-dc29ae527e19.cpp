#include<iostream>
#include<vector>
#include<limits.h>

using namespace std;

int findCoin(vector<int> arr,int target)
{
    if(target==0)
    return 0;
    if(target;;<0)
    return INT_MAX;
    int minimum=INT_MAX;

    for(int i=0;i<arr.size();i++)
    {
       int ans=findCoin(arr,target-arr[i]);
       if(ans!=INT_MAX)
       minimum=min(minimum,ans+1);
    }

    return minimum;
}

int main()
{
    vector <int> arr{1,3,4};
    int target=5;

    cout<<findCoin(arr,target);

    return 0;
}